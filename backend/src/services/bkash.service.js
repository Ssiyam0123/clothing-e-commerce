import axios from 'axios';
import crypto from 'crypto';

class BkashService {
  async getToken(creds) {
    try {
      const response = await axios.post(`${creds.baseURL}/tokenized/checkout/token/grant`, {
        app_key: creds.appKey,
        app_secret: creds.appSecret,
      });
      return response.data.id_token;
    } catch (error) {
      console.error('bKash token error:', error.response?.data || error.message);
      throw new Error('Failed to obtain bKash token');
    }
  }

  async createPayment(amount, orderId, callbackURL, creds) {
    const token = await this.getToken(creds);
    const payload = {
      mode: '0011',
      payerReference: orderId,
      callbackURL,
      amount: amount.toString(),
      currency: 'BDT',
      intent: 'sale',
      merchantInvoiceNumber: orderId,
    };
    try {
      const response = await axios.post(`${creds.baseURL}/tokenized/checkout/create`, payload, {
        headers: {
          Authorization: token,
          'X-APP-Key': creds.appKey,
        },
      });
      return {
        bkashURL: response.data.bkashURL,
        paymentID: response.data.paymentID,
      };
    } catch (error) {
      console.error('bKash create payment error:', error.response?.data || error.message);
      throw new Error('Failed to create bKash payment');
    }
  }

  async executePayment(paymentID, creds) {
    const token = await this.getToken(creds);
    try {
      const response = await axios.post(`${creds.baseURL}/tokenized/checkout/execute`, {
        paymentID,
      }, {
        headers: {
          Authorization: token,
          'X-APP-Key': creds.appKey,
        },
      });
      return response.data;
    } catch (error) {
      console.error('bKash execute payment error:', error.response?.data || error.message);
      throw new Error('Failed to execute bKash payment');
    }
  }
}

export default new BkashService();