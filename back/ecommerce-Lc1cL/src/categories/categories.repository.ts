import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from 'src/entities/categories.entity';
import { Repository } from 'typeorm';
import * as data from '../utils/data.json';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}
  async getCategoriees() {
    try {
      return await this.categoriesRepository.find();
    } catch (error) {
      return error;
    }
  }

  async addCategories() {
    try {
      for (const element of data) {
        await this.categoriesRepository
          .createQueryBuilder()
          .insert()
          .into(Categories)
          .values({ name: element.category })
          .orIgnore()
          .execute();
      }
      return 'Categories Loaded';
    } catch (error) {
      return error;
    }
  }
}
