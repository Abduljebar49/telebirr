interface TelebirrConfig {
  appId: string;
  appKey: string;
  shortCode: string;
  publicKey: string;
}

interface PaymentParams {
  paymentMethod?: "web" | "app";
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
