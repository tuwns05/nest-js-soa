import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@soa/database';
import type { ProductRequest } from './dto/product.request.js';

export interface Product extends Record<string, unknown> {
  id: number;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class ProductsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<Product[]> {
    const result = await this.databaseService.query<Product>(
      'SELECT id, name, description, price, quantity, created_at, updated_at FROM dbo.products ORDER BY id DESC',
    );
    return result.recordset;
  }

  async findOne(id: number): Promise<Product> {
    const result = await this.databaseService.query<Product>(
      'SELECT id, name, description, price, quantity, created_at, updated_at FROM dbo.products WHERE id = @id',
      { id },
    );
    return this.requireProduct(result.recordset[0]);
  }

  async create(body: ProductRequest): Promise<Product> {
    const result = await this.databaseService.query<Product>(
      `INSERT INTO dbo.products (name, description, price, quantity, created_at, updated_at)
       OUTPUT INSERTED.*
       VALUES (@name, @description, CAST(@price AS DECIMAL(10,2)), @quantity, GETDATE(), GETDATE())`,
      this.parameters(body),
    );
    return result.recordset[0];
  }

  async update(id: number, body: ProductRequest): Promise<Product> {
    const result = await this.databaseService.query<Product>(
      `UPDATE dbo.products
       SET name = @name, description = @description, price = CAST(@price AS DECIMAL(10,2)),
           quantity = @quantity, updated_at = GETDATE()
       OUTPUT INSERTED.*
       WHERE id = @id`,
      { ...this.parameters(body), id },
    );
    return this.requireProduct(result.recordset[0]);
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.databaseService.query<{ id: number }>(
      'DELETE FROM dbo.products OUTPUT DELETED.id WHERE id = @id',
      { id },
    );
    if (!result.recordset[0]) {
      throw new NotFoundException('Product not found');
    }
    return { message: 'Product deleted successfully' };
  }

  private parameters(body: ProductRequest): Record<string, unknown> {
    return {
      name: body.name,
      description: body.description ?? null,
      // mssql infers integer/float types from numbers. Pass a decimal string
      // and cast in SQL so fractional prices are preserved predictably.
      price: body.price.toFixed(2),
      quantity: body.quantity,
    };
  }

  private requireProduct(product: Product | undefined): Product {
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
}
