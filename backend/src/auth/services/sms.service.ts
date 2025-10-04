import { Injectable } from '@nestjs/common';

export interface ISMSService {
  sendOTP(phone: string, code: string): Promise<boolean>;
}

@Injectable()
export class MockSMSService implements ISMSService {
  async sendOTP(phone: string, code: string): Promise<boolean> {
    // Mock: 실제로 SMS를 보내지 않고, 콘솔에만 출력
    console.log(`[Mock SMS] 전화번호: ${phone}, 인증코드: ${code}`);

    // 실제 SMS 서비스로 교체 시 여기에 API 호출 추가
    // 예: await twilioClient.messages.create(...)
    // 예: await esmsClient.send(...)

    return true;
  }
}

// 나중에 실제 SMS 서비스로 교체 예시:
// @Injectable()
// export class TwilioSMSService implements ISMSService {
//   async sendOTP(phone: string, code: string): Promise<boolean> {
//     // Twilio API 호출
//     return true;
//   }
// }
