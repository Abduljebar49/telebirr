declare module 'telebirr-typescript' {
    export interface TelebirrConfig {
      appId: string;
      appKey: string;
      shortCode: string;
      publicKey: string;
    }
  
    export interface PaymentParams {
      paymentMethod?: 'web' | 'app';
      nonce: string;
      notifyUrl: string;
      totalAmount: number;
      outTradeNo: string;
      receiveName: string;
      returnApp?: string;
      returnUrl: string;
      subject: string;
      timeoutExpress?: string;
    }
  
    export default class Telebirr {
      constructor(config: TelebirrConfig);
      makePayment(params: PaymentParams): Promise<{ success: boolean; response?: any; error?: any }>;
      encrypt(payload: any): string;
      signData(fields: any): string;
      decryptPublic(dataToDecrypt: string): string;
      getDecryptedCallbackNotification(encryptedText: string): any;
    }
  }
  