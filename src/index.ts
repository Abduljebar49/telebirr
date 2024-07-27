import crypto from 'crypto';
import NodeRSA from 'node-rsa';
import axios from 'axios';

const TELEBIRR_H5_URL =
  'https://app.ethiomobilemoney.et:2121/ammapi/payment/service-openup/toTradeWebPay';
const TELEBIRR_IN_APP_URL =
  'https://app.ethiomobilemoney.et:2121/ammapi/payment/service-openup/toTradeMobilePay';

interface TelebirrConfig {
  appId: string;
  appKey: string;
  shortCode: string;
  publicKey: string;
}

interface PaymentParams {
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

class Telebirr {
  private appId: string;
  private appKey: string;
  private shortCode: string;
  private publicKey: string;

  constructor({ appId, appKey, shortCode, publicKey }: TelebirrConfig) {
    this.appId = appId;
    this.appKey = appKey;
    this.shortCode = shortCode;
    this.publicKey = publicKey;
  }

  async makePayment({
    paymentMethod = 'web',
    nonce,
    notifyUrl,
    totalAmount,
    outTradeNo,
    receiveName,
    returnApp = 'com.example.app',
    returnUrl,
    subject,
    timeoutExpress = `${24 * 60}`, // 1 day
  }: PaymentParams): Promise<{ success: boolean; response?: any; error?: any }> {
    const params = {
      appId: this.appId,
      appKey: this.appKey,
      nonce,
      notifyUrl,
      outTradeNo,
      receiveName,
      returnApp,
      returnUrl,
      shortCode: this.shortCode,
      subject,
      timeoutExpress,
      timestamp: new Date().getTime(),
      totalAmount,
    };

    const url = paymentMethod == 'app' ? TELEBIRR_IN_APP_URL : TELEBIRR_H5_URL;

    const payload = {
      appid: this.appId,
      sign: this.signData(params),
      ussd: this.encrypt(params),
    };

    try {
      const res = await axios.post(url, payload);
      return { success: res.data.code == 200, response: res.data };
    } catch (e) {
      console.log(e);
      return { success: false, error: e };
    }
  }

  private encrypt(payload: any): string {
    const rsaKey = new NodeRSA(
      `-----BEGIN PUBLIC KEY-----\n${this.publicKey}\n-----END PUBLIC KEY-----`,
      'public',
      {
        encryptionScheme: 'pkcs1',
      }
    );
    const dataToEncrypt = Buffer.from(JSON.stringify(payload));
    return rsaKey.encrypt(dataToEncrypt, 'base64', 'utf8');
  }

  private signData(fields: any): string {
    const encodedFields = Object.keys(fields)
      .sort()
      .map((key) => `${key}=${fields[key]}`)
      .join('&');

    return crypto.createHash('sha256').update(encodedFields).digest('hex');
  }

  private decryptPublic(dataToDecrypt: string): string {
    const rsaKey = new NodeRSA(
      `-----BEGIN PUBLIC KEY-----\n${this.publicKey}\n-----END PUBLIC KEY-----`,
      'public',
      {
        encryptionScheme: 'pkcs1',
      }
    );
    return rsaKey.decryptPublic(dataToDecrypt, 'utf8');
  }

  getDecryptedCallbackNotification(encryptedText: string): any {
    const decryptedText = this.decryptPublic(encryptedText);
    return JSON.parse(decryptedText);
  }
}

export default Telebirr;
