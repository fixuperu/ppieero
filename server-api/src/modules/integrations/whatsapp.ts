import { config } from '../../config/index.js';
import { logger } from '../../lib/logger.js';

const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';

export async function sendWhatsAppMessage(recipientId: string, text: string): Promise<void> {
  const { token, phoneNumberId } = config.whatsapp;

  if (!token || !phoneNumberId) {
    logger.warn('WhatsApp credentials not configured');
    return;
  }

  try {
    const response = await fetch(
      `${WHATSAPP_API_URL}/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: recipientId,
          type: 'text',
          text: { body: text },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      logger.error({ error }, 'WhatsApp API error');
      throw new Error(`WhatsApp API error: ${response.status}`);
    }

    logger.info({ recipientId }, 'WhatsApp message sent');
  } catch (error) {
    logger.error(error, 'Failed to send WhatsApp message');
    throw error;
  }
}
