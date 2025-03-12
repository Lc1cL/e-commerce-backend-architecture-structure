import { Controller, Get, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { Auth2Guard } from 'src/guards/auth2.guard';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService){}

    @ApiOperation({summary: 'Add categories to database. Automatically called when the server starts. [ADMIN ONLY]'})
    @Roles(Role.Admin)
    @UseGuards(Auth2Guard, RolesGuard)
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
