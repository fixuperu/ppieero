import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',

  // Admin API
  adminApiKey: process.env.ADMIN_API_KEY || '',

  // Webhook
  webhookVerifyToken: process.env.WEBHOOK_VERIFY_TOKEN || '',

  // WhatsApp
  whatsapp: {
    token: process.env.WHATSAPP_TOKEN || '',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
  },

  // Instagram
  instagram: {
    pageAccessToken: process.env.INSTAGRAM_PAGE_ACCESS_TOKEN || '',
    appId: process.env.INSTAGRAM_APP_ID || '',
    appSecret: process.env.INSTAGRAM_APP_SECRET || '',
  },

  // SimplyBook
  simplybook: {
    company: process.env.SIMPLYBOOK_COMPANY || '',
    apiKey: process.env.SIMPLYBOOK_API_KEY || '',
    secretKey: process.env.SIMPLYBOOK_SECRET_KEY || '',
    mockMode: process.env.SIMPLYBOOK_MOCK === 'true',
  },
};
