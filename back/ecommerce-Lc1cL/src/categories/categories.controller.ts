import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService){}

    @ApiOperation({summary: 'Add categories to database. Automatically called when the server starts'})
    @Get('seeder')
    async addCategories(){
        return await this.categoriesService.addCategories();

    }

    @ApiOperation({summary: 'Get all categories'})
    @Get()
    async getCategories(){
        return await this.categoriesService.getCategories();
    }
}
