import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
  ) {}

  async create(
    customerId: number,
    restaurantId: number,
    totalPrice: number,
    deliveryAddress: string,
    deliveryPhone: string,
    items: { menu_name: string; quantity: number; price: number }[]
  ): Promise<Order> {
    const order = this.ordersRepository.create({
      customer_id: customerId,
      restaurant_id: restaurantId,
      total_price: totalPrice,
      delivery_address: deliveryAddress,
      delivery_phone: deliveryPhone,
      status: 'pending',
    });

    const savedOrder = await this.ordersRepository.save(order);

    for (const item of items) {
      const orderItem = this.orderItemsRepository.create({
        order_id: savedOrder.id,
        menu_name: item.menu_name,
        quantity: item.quantity,
        price: item.price,
      });
      await this.orderItemsRepository.save(orderItem);
    }

    return savedOrder;
  }

  async findByCustomerId(customerId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { customer_id: customerId },
      relations: ['restaurant'],
      order: { created_at: 'DESC' },
    });
  }

  async findByRestaurantId(restaurantId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { restaurant_id: restaurantId },
      relations: ['customer'],
      order: { created_at: 'DESC' },
    });
  }

  async findById(id: number): Promise<Order | null> {
    return this.ordersRepository.findOne({
      where: { id },
      relations: ['customer', 'restaurant'],
    });
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return this.orderItemsRepository.find({ where: { order_id: orderId } });
  }

  async updateStatus(id: number, status: string): Promise<Order | null> {
    await this.ordersRepository.update(id, { status });
    return this.findById(id);
  }
}
