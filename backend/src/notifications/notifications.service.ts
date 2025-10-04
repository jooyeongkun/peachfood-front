import { Injectable, Logger } from '@nestjs/common';
import { initializeFirebase } from '../config/firebase.config';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private admin;

  constructor() {
    this.admin = initializeFirebase();
  }

  async sendPushNotification(token: string, title: string, body: string) {
    if (!this.admin) {
      this.logger.warn('Firebase not initialized. Push notification skipped.');
      return { success: false, message: 'Firebase not configured' };
    }

    try {
      const message = {
        notification: {
          title,
          body,
        },
        token,
      };

      const response = await this.admin.messaging().send(message);
      this.logger.log(`푸시 알림 전송 성공: ${response}`);
      return { success: true, messageId: response };
    } catch (error) {
      this.logger.error(`푸시 알림 전송 실패: ${error.message}`);
      throw error;
    }
  }

  async sendOrderStatusNotification(
    orderId: string,
    status: string,
    fcmToken: string,
  ) {
    const statusMessages = {
      confirmed: {
        title: '주문 확인',
        body: '주문이 확인되었습니다. 조리를 시작합니다.',
      },
      picked_up: {
        title: '배달 시작',
        body: '기사가 배달을 시작했습니다.',
      },
      arrived: {
        title: '배송지 도착',
        body: '배달이 배송지에 도착했습니다. 주문을 픽업해주세요.',
      },
      delivered: {
        title: '배달 완료',
        body: '배달이 완료되었습니다. 이용해주셔서 감사합니다.',
      },
    };

    const message = statusMessages[status];
    if (!message) {
      throw new Error(`Invalid status: ${status}`);
    }

    return this.sendPushNotification(fcmToken, message.title, message.body);
  }
}
