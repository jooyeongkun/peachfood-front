import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() body: any) {
    return this.ordersService.create(
      req.user.userId,
      body.restaurant_id,
      body.total_price,
      body.delivery_address,
      body.delivery_phone,
      body.items,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyOrders(@Request() req) {
    return this.ordersService.findByCustomerId(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('restaurant/:restaurantId')
  async getRestaurantOrders(@Param('restaurantId') restaurantId: string) {
    return this.ordersService.findByRestaurantId(+restaurantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ordersService.findById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/items')
  async getOrderItems(@Param('id') id: string) {
    return this.ordersService.getOrderItems(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.ordersService.updateStatus(+id, body.status);
  }
}
