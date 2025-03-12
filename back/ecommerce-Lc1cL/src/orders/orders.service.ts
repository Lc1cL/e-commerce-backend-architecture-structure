import { Injectable } from "@nestjs/common";
import { OrderRepository } from "./orders.repository";


@Injectable()
export class OrderService{

    constructor(private readonly ordersRepository: OrderRepository){}

    async addOrder(userId: string, products: any){
        return await this.ordersRepository.addOrder(userId, products)
    }

    async getOrder(id: string ){
        return await this.ordersRepository.getOrder(id)
    }
}