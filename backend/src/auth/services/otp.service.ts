import { Injectable } from '@nestjs/common';
import { MockSMSService } from './sms.service';
import { MockEmailService } from './email.service';

interface OTPData {
  code: string;
  expiresAt: Date;
  attempts: number;
}

@Injectable()
export class OTPService {
  // 메모리 기반 OTP 저장소 (프로덕션에서는 Redis 사용 권장)
  private otpStore = new Map<string, OTPData>();
  private readonly OTP_EXPIRY_MINUTES = 5;
  private readonly MAX_ATTEMPTS = 5;

  constructor(
    private smsService: MockSMSService,
    private emailService: MockEmailService,
  ) {}

  // OTP 생성 (4자리)
  private generateOTP(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  // 이메일인지 전화번호인지 판별
  private isEmail(identifier: string): boolean {
    return identifier.includes('@');
  }

  // OTP 발송 (이메일 또는 전화번호)
  async sendOTP(identifier: string): Promise<{ success: boolean; message: string; code?: string }> {
    // 기존 OTP 삭제
    this.otpStore.delete(identifier);

    // 새 OTP 생성
    const code = this.generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.OTP_EXPIRY_MINUTES);

    // OTP 저장
    this.otpStore.set(identifier, {
      code,
      expiresAt,
      attempts: 0,
    });

    // 이메일 또는 SMS 발송
    if (this.isEmail(identifier)) {
      await this.emailService.sendOTP(identifier, code);
    } else {
      await this.smsService.sendOTP(identifier, code);
    }

    return {
      success: true,
      message: '인증번호가 발송되었습니다',
      code, // 개발 환경용 - 프로덕션에서는 제거 필요
    };
  }

  // OTP 검증 (이메일 또는 전화번호)
  async verifyOTP(identifier: string, code: string): Promise<{ success: boolean; message: string }> {
    console.log(`[OTP 검증 시도] 식별자: ${identifier}, 입력된 코드: ${code}`);

    const otpData = this.otpStore.get(identifier);

    // OTP가 없는 경우
    if (!otpData) {
      console.log(`[OTP 검증 실패] 저장된 OTP 없음 - 식별자: ${identifier}`);
      return {
        success: false,
        message: '인증번호를 먼저 요청해주세요',
      };
    }

    console.log(`[OTP 검증] 저장된 코드: ${otpData.code}, 시도 횟수: ${otpData.attempts}, 만료시간: ${otpData.expiresAt}`);

    // 시도 횟수 초과
    if (otpData.attempts >= this.MAX_ATTEMPTS) {
      this.otpStore.delete(identifier);
      console.log(`[OTP 검증 실패] 시도 횟수 초과 - 식별자: ${identifier}`);
      return {
        success: false,
        message: '인증 시도 횟수를 초과했습니다. 다시 요청해주세요',
      };
    }

    // 만료 확인
    if (new Date() > otpData.expiresAt) {
      this.otpStore.delete(identifier);
      console.log(`[OTP 검증 실패] 만료됨 - 식별자: ${identifier}`);
      return {
        success: false,
        message: '인증번호가 만료되었습니다. 다시 요청해주세요',
      };
    }

    // 시도 횟수 증가
    otpData.attempts++;

    // 코드 확인
    if (otpData.code !== code) {
      console.log(`[OTP 검증 실패] 코드 불일치 - 식별자: ${identifier}, 저장된: ${otpData.code}, 입력된: ${code}`);
      return {
        success: false,
        message: '인증번호가 일치하지 않습니다',
      };
    }

    // 인증 성공 - OTP 삭제
    this.otpStore.delete(identifier);
    console.log(`[OTP 검증 성공] 식별자: ${identifier}`);

    return {
      success: true,
      message: '인증되었습니다',
    };
  }

  // 만료된 OTP 정리 (주기적으로 실행)
  cleanExpiredOTPs() {
    const now = new Date();
    for (const [phone, data] of this.otpStore.entries()) {
      if (now > data.expiresAt) {
        this.otpStore.delete(phone);
      }
    }
  }
}
