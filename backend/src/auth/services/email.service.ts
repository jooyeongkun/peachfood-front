import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export interface IEmailService {
  sendOTP(email: string, code: string): Promise<boolean>;
}

@Injectable()
export class GmailService implements IEmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Gmail SMTP 설정
    // 실제 사용 시: Gmail 계정과 앱 비밀번호를 환경변수로 설정하세요
    // 1. Gmail 계정 설정 -> 보안 -> 2단계 인증 활성화
    // 2. 앱 비밀번호 생성
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || 'your-email@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD || 'your-app-password',
      },
    });
  }

  async sendOTP(email: string, code: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.GMAIL_USER || 'your-email@gmail.com',
        to: email,
        subject: '배달 앱 - 이메일 인증번호',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">이메일 인증</h2>
            <p style="font-size: 16px; color: #666;">
              안녕하세요!<br>
              요청하신 인증번호는 다음과 같습니다:
            </p>
            <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #007AFF; letter-spacing: 5px;">
                ${code}
              </span>
            </div>
            <p style="font-size: 14px; color: #999;">
              이 인증번호는 5분간 유효합니다.<br>
              본인이 요청하지 않았다면 이 이메일을 무시하세요.
            </p>
          </div>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`[이메일 전송] ${email} -> 성공: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error(`[이메일 전송 실패] ${email}:`, error);
      return false;
    }
  }
}

// 개발 환경용: 이메일을 실제로 보내지 않고 콘솔에만 출력
@Injectable()
export class MockEmailService implements IEmailService {
  async sendOTP(email: string, code: string): Promise<boolean> {
    console.log(`[Mock Email] 이메일: ${email}, 인증코드: ${code}`);
    return true;
  }
}
