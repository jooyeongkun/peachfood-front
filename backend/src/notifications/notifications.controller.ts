import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send-order-status')
  @HttpCode(HttpStatus.OK)
  async sendOrderStatus(
    @Body()
    body: {
      orderId: string;
      status: string;
      fcmToken: string;
    },
  ) {
    try {
      const result =
        await this.notificationsService.sendOrderStatusNotification(
          body.orderId,
          body.status,
          body.fcmToken,
        );
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
