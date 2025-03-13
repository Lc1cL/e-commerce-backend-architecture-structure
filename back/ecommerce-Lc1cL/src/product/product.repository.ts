import {
  Injectable,
  InternalServerErrorException,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/products.entity';
import { Repository } from 'typeorm';
import { Categories } from 'src/entities/categories.entity';
import * as data from '../utils/data.json';
import { Order } from 'src/entities/orders.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async getProducts(page: number, limit: number): Promise<Product[]> {
    try {
      page = page || 1;
      limit = limit || 5;
      const start = (page - 1) * limit;
      const end = start + limit;

      const products = await this.productRepository.find({
        relations: { category: true },
      });

      return products.slice(start, end);
    } catch (error) {
      console.error(`Error fetching products: ${error.message}`, error);
      throw new InternalServerErrorException('Failed to fetch products');
    }
  }

  async getById(id: string) {
    try {
      const product = await this.productRepository.findOne({ where: { id } });

      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }

      return product;
    } catch (error) {
      console.error(
        `Error fetching product with id ${id}: ${error.message}`,
        error,
      );
      throw new InternalServerErrorException(
        `Failed to fetch product with id ${id}`,
      );
    }
  }

  async addProduct() {
    try {
      const categories = await this.categoriesRepository.find();
      for (const element of data) {
        const category = categories.find(
          (category) => category.name === element.category,
        );
  
        if (category) {
          const newProduct = new Product();
          newProduct.name = element.name;
          newProduct.description = element.description;
          newProduct.price = element.price;
          newProduct.imgUrl = element.imgUrl;
          newProduct.stock = element.stock;
          newProduct.category = category;
  
          await this.productRepository
            .createQueryBuilder()
            .insert()
            .into(Product)
            .values(newProduct)
            .orUpdate(['description', 'price', 'imgUrl', 'stock'], ['name'])
            .execute();
  
          console.log(`Product added: ${element.name}`);
        } else {
          console.error(
            `Category ${element.category} not found for product ${element.name}`,
          );
        }
      }
      console.log('All products added successfully');
      return 'All products added successfully';
    } catch (error) {
      console.error(`Error adding product: ${error.message}`, error);
      throw new InternalServerErrorException('Failed to add product');
    }
  }
  

  async updateProduct(id: string, product: Partial<Product>) {
    try {
      const existingProduct = await this.productRepository.findOneBy({ id });
      if (!existingProduct) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }

      const result = await this.productRepository.update(
        existingProduct,
        product,
      );
      if (result.affected === 0) {
        throw new InternalServerErrorException(
          `Failed to update product with id ${id}`,
        );
      }

      return await this.productRepository.findOneBy({ id });
    } catch (error) {
      console.error(`Failed to update product with id ${id}: ${error.message}`);
      throw new Error(`Failed to update product with id ${id}`);
    }
  }

  async deleteById(id: string) {
    try {
      const product = await this.productRepository.findOneBy({ id });

      if (!product) {
        throw new NotFoundException(`No product was found with id ${id}`);
      }

      await this.productRepository.delete({ id });
      return `Product with id ${id} was deleted successfully`;
    } catch (error) {
      console.error(
        `Error deleting product with id ${id}: ${error.message}`,
        error,
      );
      throw new InternalServerErrorException(
        `Failed to delete product with id ${id}`,
      );
    }
  }

  async deleteProducts() {
    try {
      const products = await this.productRepository.find();

      if (!products || products.length === 0) {
        return 'There are no existing products loaded at the moment';
      }

      const orders = await this.orderRepository.find();

      if (orders && orders.length > 0) {
        throw new MethodNotAllowedException(
          'An order is in progress. Product deletion is not allowed at this time',
        );
      }

      await this.productRepository.clear();
      return 'All products deleted successfully';
    } catch (error) {
      console.error(`Error deleting all products: ${error.message}`, error);
      if (error instanceof MethodNotAllowedException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete products');
    }
  }
}
