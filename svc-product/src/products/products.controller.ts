import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProductRequest } from './dto/product.request.js';
import { ProductsService } from './products.service.js';

@ApiTags('products')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing, invalid or expired JWT' })
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List all products' })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a product' })
  create(@Body() body: ProductRequest) {
    return this.productsService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product (send all required fields)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() body: ProductRequest) {
    return this.productsService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
