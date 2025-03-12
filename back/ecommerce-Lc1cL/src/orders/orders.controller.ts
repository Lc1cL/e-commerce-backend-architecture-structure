import { Controller, Get, Param, Post, Body, ParseUUIDPipe, UseGuards, Delete} from "@nestjs/common";
import { OrderService } from "./orders.service";
import { CreateOrderDto } from "./orders.dto";
import { Auth2Guard } from "src/guards/auth2.guard";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
    constructor (private readonly orderService : OrderService){}

    @UseGuards(Auth2Guard)
    @Post()
    @ApiOperation({summary: 'Create a new order'})
    @ApiBody({type: CreateOrderDto})
    @UseGuards(Auth2Guard)
    async addOrder(@Body() order: CreateOrderDto){
        const {userId, products } = order;
        return await this.orderService.addOrder(userId, products);
    }

    @UseGuards(Auth2Guard)
    @Get(':id')
    @ApiOperation({summary: 'Get order by id'})
    @ApiParam({name: 'id', type: String, description:'Order id'})
    @UseGuards(Auth2Guard)
    async getOrder(@Param('id', ParseUUIDPipe) id : string) {
        return await this.orderService.getOrder(id);
    }
}