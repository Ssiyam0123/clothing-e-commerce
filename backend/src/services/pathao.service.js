import axios from 'axios';
import redisClient from '../config/redis.js';

class PathaoService {
  /**
   * 🛡️ ক্যাশ রেডি কি না চেক করা
   */
  get isCacheReady() {
    return redisClient && redisClient.status === 'ready';
  }

  /**
   * 🔗 URL স্যানিটাইজেশন (Trailing slash রিমুভ করা)
   */
  formatURL(url) {
    return (url || 'https://courier-api-sandbox.pathao.com').replace(/\/$/, '');
  }

  /**
   * 🔑 এক্সেস টোকেন জেনারেট করা (Dynamic & Cached)
   */
  async getToken(creds) {
    // প্রতিটা ক্লায়েন্টের জন্য আলাদা ক্যাশ কী যাতে ক্রেডেনশিয়াল চেঞ্জ করলে সমস্যা না হয়
    const cacheKey = `pathao:token:${creds.clientId}`;
    
    if (this.isCacheReady) {
      const cached = await redisClient.get(cacheKey);
      if (cached) return cached;
    }

    const url = this.formatURL(creds.baseURL);

    try {
      const response = await axios.post(`${url}/aladdin/api/v1/issue-token`, {
        client_id: creds.clientId,
        client_secret: creds.clientSecret,
        username: creds.userName,
        password: creds.password,
        grant_type: 'password',
      });

      const token = response.data.access_token;
      const expiresIn = response.data.expires_in || 3600;

      if (this.isCacheReady) {
        // টোকেন এক্সপায়ার হওয়ার ৫ মিনিট আগেই ক্যাশ ডিলিট করবে সেফটির জন্য
        await redisClient.setex(cacheKey, expiresIn - 300, token);
      }
      return token;
    } catch (error) {
      console.error('❌ Pathao Auth Error:', error.response?.data || error.message);
      throw new Error(`Authentication failure: ${error.response?.data?.message || 'Check your credentials in Vault.'}`);
    }
  }

  /**
   * 🏙️ সিটি লিস্ট ফেচ করা
   */
  async getCities(creds) {
    const cacheKey = 'pathao:cities';
    
    if (this.isCacheReady) {
      const cached = await redisClient.get(cacheKey);
      if (cached) return JSON.parse(cached);
    }

    const token = await this.getToken(creds);
    const url = this.formatURL(creds.baseURL);

    const response = await axios.get(`${url}/aladdin/api/v1/city-list`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = response.data.data.data || response.data.data;

    if (this.isCacheReady) {
      await redisClient.setex(cacheKey, 86400, JSON.stringify(data)); // ২৪ ঘণ্টা ক্যাশ থাকবে
    }
    return data;
  }

  /**
   * 📍 জোন লিস্ট ফেচ করা
   */
  async getZones(cityId, creds) {
    const cacheKey = `pathao:zones:${cityId}`;
    
    if (this.isCacheReady) {
      const cached = await redisClient.get(cacheKey);
      if (cached) return JSON.parse(cached);
    }

    const token = await this.getToken(creds);
    const url = this.formatURL(creds.baseURL);

    const response = await axios.get(`${url}/aladdin/api/v1/cities/${cityId}/zone-list`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = response.data.data.data || response.data.data;

    if (this.isCacheReady) {
      await redisClient.setex(cacheKey, 86400, JSON.stringify(data));
    }
    return data;
  }

  /**
   * 🗺️ এরিয়া লিস্ট ফেচ করা
   */
  async getAreas(zoneId, creds) {
    const cacheKey = `pathao:areas:${zoneId}`;
    
    if (this.isCacheReady) {
      const cached = await redisClient.get(cacheKey);
      if (cached) return JSON.parse(cached);
    }

    const token = await this.getToken(creds);
    const url = this.formatURL(creds.baseURL);

    const response = await axios.get(`${url}/aladdin/api/v1/zones/${zoneId}/area-list`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = response.data.data.data || response.data.data;

    if (this.isCacheReady) {
      await redisClient.setex(cacheKey, 86400, JSON.stringify(data));
    }
    return data;
  }

  /**
   * 🚛 অর্ডার/কনসাইনমেন্ট ক্রিয়েট করা
   */
  async createOrder(payload, creds) {
    const token = await this.getToken(creds);
    const url = this.formatURL(creds.baseURL);

    try {
      const response = await axios.post(`${url}/aladdin/api/v1/orders`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('❌ Pathao Order Failed:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to sync with Pathao Logistics.');
    }
  }
}

export default new PathaoService();