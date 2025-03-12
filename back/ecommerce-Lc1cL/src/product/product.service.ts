import { Injectable } from "@nestjs/common";
import { ProductRepository } from "./product.repository";
import { Product } from "../entities/products.entity";

@Injectable()
export class ProductsService {
    constructor(private productRepository: ProductRepository){}
    
    async addProduct() {
        return await this.productRepository.addProduct();
    }

    async getProductById(id : string) {
        return await this.productRepository.getById(id);
    }

    async getProducts(page: number, limit: number) {
        return await this.productRepository.getProducts(page, limit);
    }

    async updateProduct(id: string, product: Partial<Product>){
        return await this.productRepository.updateProduct(id, product)
    }

    async deleteProductById(id: string) {
        return await this.productRepository.deleteById(id);
    }
    async deleteProducts(){
        return await this.productRepository.deleteProducts();
    }
}