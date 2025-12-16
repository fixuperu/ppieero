import { config } from '../../config/index.js';
import { logger } from '../../lib/logger.js';

const INSTAGRAM_API_URL = 'https://graph.facebook.com/v18.0';

export async function sendInstagramMessage(recipientId: string, text: string): Promise<void> {
  const { pageAccessToken } = config.instagram;

  if (!pageAccessToken) {
    logger.warn('Instagram credentials not configured');
    return;
  }

  try {
    const response = await fetch(
      `${INSTAGRAM_API_URL}/me/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: pageAccessToken,
          recipient: { id: recipientId },
          message: { text },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      logger.error({ error }, 'Instagram API error');
      throw new Error(`Instagram API error: ${response.status}`);
    }

    logger.info({ recipientId }, 'Instagram message sent');
  } catch (error) {
    logger.error(error, 'Failed to send Instagram message');
    throw error;
  }
}
