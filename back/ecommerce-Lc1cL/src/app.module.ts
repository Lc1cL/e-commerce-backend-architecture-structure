import { MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { ProductModule } from './product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { CategoriesRepository } from './categories/categories.repository';
import { ProductRepository } from './product/product.repository';
import { Categories } from './entities/categories.entity';
import { Product } from './entities/products.entity';
import { Order } from './entities/orders.entity';
import { ConfigModuleRoot } from './config/configModuleRoot';
import { ConfigTypeOrm } from './config/configTypeOrm';

@Module({
  imports: [
    ConfigModuleRoot,
    ConfigTypeOrm,
    UsersModule,
    ProductModule,
    AuthModule,
    CategoriesModule,
    OrdersModule,
    FileUploadModule,
    TypeOrmModule.forFeature([Categories, Product, Order])
  ],
  controllers: [],
  providers: [CategoriesRepository, ProductRepository],
})
export class AppModule implements OnModuleInit {
  constructor( private readonly categoriesRepository: CategoriesRepository,
    private readonly productRepository: ProductRepository,
  ){}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/');
  }
  
  async onModuleInit() {
      await this.categoriesRepository.addCategories()
      await this.productRepository.addProduct();
  }
}
