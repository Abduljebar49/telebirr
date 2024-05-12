type PaymentMethod = 'web' | 'app';


export interface TelebirrOptions {
    appId: string;
    appKey: string;
    shortCode: string;
    publicKey: string;
}

export interface PaymentOptions {
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

export interface PaymentResponse {
    success: boolean;
    response?: any;
    error?: any;
}
export interface PaymentParams {
    paymentMethod?: PaymentMethod;
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

export interface TelebirrConfig {
    appId: string;
    appKey: string;
    shortCode: string;
    publicKey: string;
}

export interface TelebirrResponse {
    success: boolean;
    response?: any;
    error?: any;
}
