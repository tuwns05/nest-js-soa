import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '@soa/database';
import request from 'supertest';
// Test production compilation, including Nest constructor and DTO metadata.
import { AppModule } from '../dist/app.module.js';
import { jwtSecret } from '../dist/config.js';
import { setupSwagger } from '../dist/swagger.js';

describe('Product API', () => {
  let app: INestApplication;
  let token: string;
  const database = { query: vi.fn() };
  const jwt = new JwtService({ secret: jwtSecret });
  const body = {
    name: 'Bàn phím cơ',
    description: 'USB',
    price: 750000.25,
    quantity: 20,
  };
  const product = {
    id: 1,
    ...body,
    created_at: '2026-10-16T00:00:00.000Z',
    updated_at: '2026-10-16T00:00:00.000Z',
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(DatabaseService)
      .useValue(database)
      .compile();
    app = module.createNestApplication();
    setupSwagger(app);
    await app.init();
  });

  beforeEach(async () => {
    database.query.mockReset();
    token = await jwt.signAsync(
      { sub: '1', username: 'test-user' },
      { expiresIn: '60s' },
    );
  });

  afterAll(async () => {
    await app?.close();
  });

  it.each([
    ['get', '/products'],
    ['get', '/products/1'],
    ['post', '/products'],
    ['put', '/products/1'],
    ['delete', '/products/1'],
  ] as const)('rejects unauthenticated %s %s', async (method, path) => {
    await request(app.getHttpServer())[method](path).send(body).expect(401);
    expect(database.query).not.toHaveBeenCalled();
  });

  it.each(['malformed', 'expired', 'wrong-key'])(
    'rejects %s tokens',
    async (kind) => {
      const invalidToken =
        kind === 'malformed'
          ? 'invalid.token'
          : await jwt.signAsync(
              { sub: '1' },
              kind === 'expired'
                ? { expiresIn: -1 }
                : { secret: 'another-key', expiresIn: '60s' },
            );
      await request(app.getHttpServer())
        .get('/products')
        .auth(invalidToken, { type: 'bearer' })
        .expect(401);
      expect(database.query).not.toHaveBeenCalled();
    },
  );

  it('lists products with a valid token', async () => {
    database.query.mockResolvedValueOnce({ recordset: [product] });
    await request(app.getHttpServer())
      .get('/products')
      .auth(token, { type: 'bearer' })
      .expect(200, [product]);
  });

  it('gets a product by ID', async () => {
    database.query.mockResolvedValueOnce({ recordset: [product] });
    await request(app.getHttpServer())
      .get('/products/1')
      .auth(token, { type: 'bearer' })
      .expect(200, product);
    expect(database.query.mock.calls[0][1]).toEqual({ id: 1 });
  });

  it('creates a product and preserves decimal price', async () => {
    database.query.mockResolvedValueOnce({ recordset: [product] });
    await request(app.getHttpServer())
      .post('/products')
      .auth(token, { type: 'bearer' })
      .send(body)
      .expect(201, product);
    expect(database.query.mock.calls[0][1]).toEqual({
      ...body,
      price: '750000.25',
    });
  });

  it('allows omitted description', async () => {
    database.query.mockResolvedValueOnce({
      recordset: [{ ...product, description: null }],
    });
    await request(app.getHttpServer())
      .post('/products')
      .auth(token, { type: 'bearer' })
      .send({ name: body.name, price: 10, quantity: 0 })
      .expect(201);
    expect(database.query.mock.calls[0][1].description).toBeNull();
  });

  it('updates a product', async () => {
    const updated = { ...product, quantity: 5 };
    database.query.mockResolvedValueOnce({ recordset: [updated] });
    await request(app.getHttpServer())
      .put('/products/1')
      .auth(token, { type: 'bearer' })
      .send({ ...body, quantity: 5 })
      .expect(200, updated);
  });

  it('deletes a product', async () => {
    database.query.mockResolvedValueOnce({ recordset: [{ id: 1 }] });
    await request(app.getHttpServer())
      .delete('/products/1')
      .auth(token, { type: 'bearer' })
      .expect(200, { message: 'Product deleted successfully' });
  });

  it.each(['get', 'put', 'delete'] as const)(
    'returns 404 for missing product on %s',
    async (method) => {
      database.query.mockResolvedValueOnce({ recordset: [] });
      await request(app.getHttpServer())
        [method]('/products/999')
        .auth(token, { type: 'bearer' })
        .send(body)
        .expect(404);
    },
  );

  it.each([
    { name: '   ' },
    { name: 'x'.repeat(256) },
    { price: -1 },
    { price: 1.234 },
    { price: 100000000 },
    { quantity: -1 },
    { quantity: 1.5 },
    { quantity: 2147483648 },
    { unexpected: true },
  ])('rejects invalid product fields: %j', async (invalid) => {
    await request(app.getHttpServer())
      .post('/products')
      .auth(token, { type: 'bearer' })
      .send({ ...body, ...invalid })
      .expect(400);
    expect(database.query).not.toHaveBeenCalled();
  });

  it('requires complete fields on PUT', async () => {
    await request(app.getHttpServer())
      .put('/products/1')
      .auth(token, { type: 'bearer' })
      .send({ quantity: 1 })
      .expect(400);
    expect(database.query).not.toHaveBeenCalled();
  });

  it('rejects non-numeric IDs', async () => {
    await request(app.getHttpServer())
      .get('/products/abc')
      .auth(token, { type: 'bearer' })
      .expect(400);
    expect(database.query).not.toHaveBeenCalled();
  });

  it('exposes Swagger with bearer security and product request schemas', async () => {
    const response = await request(app.getHttpServer())
      .get('/api-json')
      .expect(200);
    expect(response.body.components.securitySchemes.bearer.scheme).toBe(
      'bearer',
    );
    expect(
      response.body.paths['/products'].post.requestBody.content[
        'application/json'
      ].schema,
    ).toEqual({ $ref: '#/components/schemas/ProductRequest' });
    expect(response.body.paths['/products'].get.security).toEqual([
      { bearer: [] },
    ]);
    expect(response.body.paths['/products/{id}'].delete).toBeDefined();
    await request(app.getHttpServer()).get('/api/').expect(200);
  });
});
