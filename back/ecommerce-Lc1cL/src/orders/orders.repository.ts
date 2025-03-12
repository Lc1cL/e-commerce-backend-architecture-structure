import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Console } from 'console';
import { OrderDetails } from 'src/entities/orderDetails.entity';
import { Order } from 'src/entities/orders.entity';
import { Product } from 'src/entities/products.entity';
import { User } from 'src/entities/users.entity';
import { DataSource, Not, Repository } from 'typeorm';
import { ProductOrderDto } from './orders.dto';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetails)
    private readonly orderDetailsRepository: Repository<OrderDetails>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async addOrder(userId: string, products: ProductOrderDto[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let total = 0;

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }

      const order = new Order();
      order.date = new Date();
      order.user = user;

      const newOrder = await queryRunner.manager.save(order);

      const productsArray = await Promise.all(
        products.map(async (element) => {
          console.log(`[ORDER] Searching for product with ID: ${element.id}`);

          const product = await this.productRepository.findOneBy({
            id: element.id,
          });
          if (!product) {
            throw new NotFoundException(
              `Product with id ${element.id} not found`,
            );
          }

          if (product.stock < element.quantity) {
            throw new BadRequestException(
              `Not enough stock for product ${product.name}`,
            );
          }

          total += Number(product.price) * element.quantity;

          await queryRunner.manager.update(Product, element.id, {
            stock: product.stock - element.quantity,
          });

          return { ...product, quantity: element.quantity };
        }),
      );

      console.log(`[ORDER] Total price calculated: ${total}`);

      const orderDetail = new OrderDetails();
      orderDetail.price = Number(total.toFixed(2));
      orderDetail.products = productsArray;
      orderDetail.order = newOrder;

      const newOrderDetail = await queryRunner.manager.save(orderDetail);
      newOrder.orderDetails = newOrderDetail;
      await queryRunner.manager.save(newOrder);

      await queryRunner.commitTransaction();

      return await this.orderRepository.findOne({
        where: { id: newOrder.id },
        relations: { orderDetails: true },
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        console.error(`[ORDER ERROR] Controlled error: ${error.message}`);
        throw error;
      }

      console.error(`[ORDER ERROR] Unexpected error: ${error.message}`, error);
      throw new InternalServerErrorException(
        'Unexpected error while creating order',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getOrder(id: string) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: {
          orderDetails: {
            products: true,
          },
        },
      });

      if (!order) {
        throw new NotFoundException(`Order with id ${id} not found`);
      }

      return order;
    } catch (error) {
      if (error instanceof NotFoundException) {
        console.error(`[ORDER ERROR] Controlled error: ${error.message}`);
        throw error;
      }

      console.error(`[ORDER ERROR] Unexpected error: ${error.message}`, error);
      throw new InternalServerErrorException(
        'Unexpected error while getting order',
      );
    }
  }
}
