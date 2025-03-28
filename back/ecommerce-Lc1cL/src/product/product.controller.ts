import { Controller, Get, Post, Put, Delete, HttpCode, Param, Body, UseGuards, Query, ParseUUIDPipe } from "@nestjs/common";
import { ProductsService } from "./product.service";
import { Product } from "../entities/products.entity";
import { Auth2Guard } from "src/guards/auth2.guard";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/auth/roles.enum";
import { RolesGuard } from "src/guards/roles.guard";
import {  ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";

@ApiTags('Products')
@Controller ('products')
export class ProductsController {
    constructor (private readonly productsService: ProductsService){}
    
    @Get()
    @HttpCode(200)
    @ApiOperation({summary: 'Get all products'})
    @ApiQuery({name: 'limit', required: false, description: 'Limit number of products per page',  schema: { default: 5 }})
    @ApiQuery({name: 'page', required: false, description: 'Page displayed from list of products ', schema: { default: 1 }})
    async getProducts(@Query('page') page?:string, @Query('limit') limit?:string){
        return await this.productsService.getProducts(Number(page),Number(limit))
    }

    @ApiBearerAuth()
    @HttpCode(201)
    @Roles(Role.Admin)
    @UseGuards(Auth2Guard, RolesGuard)
    @Get('seeder')
    @ApiOperation({summary: 'Add products [ADMIN ONLY]', description: 'Add products to the database. Automatically called when the server starts.'})
    async addProducts() {
        return await this.productsService.addProduct();
    }

    @HttpCode(200)
    @Get(':id')
    @ApiOperation({summary: 'Get product by id'})
    @ApiParam({name: 'id', type: String, description:'Product id'})
    async getProductById(@Param('id', ParseUUIDPipe) id : string){
        return await this.productsService.getProductById(id)
    }

    @ApiBearerAuth()
    @HttpCode(200)
    @Put(':id')
    @ApiOperation({summary: 'Update product [ADMIN ONLY]'})
    @ApiParam({name: 'id', type: String, description:'Product id'})
    @Roles(Role.Admin)
    @UseGuards(Auth2Guard, RolesGuard)
    async UpdateProduct(@Param('id', ParseUUIDPipe) id:string, @Body() product : Partial<Product>){
        return await this.productsService.updateProduct(id, product);
    }

    @ApiBearerAuth()
    @HttpCode(200)
    @Delete(':id')
    @ApiOperation({summary: 'Delete product by id [ADMIN ONLY]'})
    @ApiParam({name: 'id', type: String, description:'Product id'})
    @Roles(Role.Admin)
    @UseGuards(Auth2Guard, RolesGuard)
    async DeleteProduct(@Param('id', ParseUUIDPipe) id : string){
            return await this.productsService.deleteProductById(id)
    }

    @ApiBearerAuth()
    @Delete()
    @ApiOperation({summary: 'Delete all products [ADMIN ONLY]'})
    @Roles(Role.Admin)
    @UseGuards(Auth2Guard, RolesGuard)
    async DeletProducts(){
        return await this.productsService.deleteProducts()
    }
}