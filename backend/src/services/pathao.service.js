import axios from 'axios';
import redisClient from '../config/redis.js';

class PathaoService {
    // 🛡️ ক্যাশ রেডি কি না চেক করা
    get isCacheReady() {
        return redisClient && redisClient.status === 'ready';
    }

    // 🔗 URL স্যানিটাইজেশন
    formatURL(url) {
        return (url || 'https://courier-api-sandbox.pathao.com').replace(/\/$/, '');
    }

    // 🔑 এক্সেস টোকেন জেনারেট করা (Dynamic & Cached)
    async getToken(creds) {
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
                await redisClient.setex(cacheKey, expiresIn - 300, token);
            }
            return token;
        } catch (error) {
            console.error('❌ Pathao Auth Error:', error.response?.data || error.message);
            throw new Error(`Authentication failure: ${error.response?.data?.message || 'Check credentials.'}`);
        }
    }

    // 🔍 অ্যাড্রেস স্ট্রিং থেকে অটোমেটিক আইডি খুঁজে বের করা
    async autoResolveAddress(addressString, creds) {
        const token = await this.getToken(creds);
        const url = this.formatURL(creds.baseURL);

        try {
            const response = await axios.get(`${url}/aladdin/api/v1/areas/search`, {
                params: { name: addressString },
                headers: { Authorization: `Bearer ${token}` }
            });

            const suggestions = response.data.data;

            if (suggestions && suggestions.length > 0) {
                // সবথেকে কাছের ম্যাচটা রিটার্ন করছি
                const bestMatch = suggestions[0];
                return {
                    city_id: bestMatch.city_id,
                    zone_id: bestMatch.zone_id,
                    area_id: bestMatch.area_id,
                    full_address: bestMatch.full_address
                };
            }
            return null;
        } catch (error) {
            console.error('❌ Pathao Resolve Error:', error.message);
            return null;
        }
    }

    // 🚛 কনসাইনমেন্ট ক্রিয়েট করা
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
            throw new Error(error.response?.data?.message || 'Failed to sync with Pathao.');
        }
    }
}

export default new PathaoService();