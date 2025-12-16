import { config } from '../../config/index.js';
import { logger } from '../../lib/logger.js';

interface BookingParams {
  serviceId: string;
  startDateTime: Date;
  clientData: any;
  staffId?: string;
}

interface BookingResult {
  id: string;
  date: string;
  status: string;
}

// Mock data for development
const MOCK_SLOTS = [
  '10:00 AM - Lunes 16 Dic',
  '2:00 PM - Lunes 16 Dic',
  '11:00 AM - Martes 17 Dic',
  '3:00 PM - Martes 17 Dic',
  '10:00 AM - Miércoles 18 Dic',
];

const MOCK_SERVICES = [
  { id: '1', name: 'Consulta General', duration: 30 },
  { id: '2', name: 'Tratamiento Especial', duration: 60 },
  { id: '3', name: 'Revisión', duration: 15 },
];

export async function listServices(): Promise<any[]> {
  if (config.simplybook.mockMode) {
    logger.info('SimplyBook MOCK: Returning mock services');
    return MOCK_SERVICES;
  }

  // Real SimplyBook API call would go here
  throw new Error('SimplyBook real API not implemented');
}

export async function getAvailability(
  serviceId: string,
  dateRange: Date,
  staffId?: string
): Promise<string[]> {
  if (config.simplybook.mockMode) {
    logger.info({ serviceId }, 'SimplyBook MOCK: Returning mock availability');
    return MOCK_SLOTS;
  }

  // Real SimplyBook API call would go here
  // CRITICAL: SimplyBook is always source of truth for availability
  throw new Error('SimplyBook real API not implemented');
}

export async function createBooking(params: BookingParams): Promise<BookingResult> {
  if (config.simplybook.mockMode) {
    logger.info({ params }, 'SimplyBook MOCK: Creating mock booking');
    return {
      id: `mock-${Date.now()}`,
      date: 'Lunes 16 Dic a las 10:00 AM',
      status: 'confirmed',
    };
  }

  // Real SimplyBook API call would go here
  throw new Error('SimplyBook real API not implemented');
}

export async function cancelBooking(bookingId: string): Promise<void> {
  if (config.simplybook.mockMode) {
    logger.info({ bookingId }, 'SimplyBook MOCK: Cancelling mock booking');
    return;
  }

  throw new Error('SimplyBook real API not implemented');
}

export async function rescheduleBooking(
  bookingId: string,
  newStartDateTime: Date
): Promise<BookingResult> {
  if (config.simplybook.mockMode) {
    logger.info({ bookingId, newStartDateTime }, 'SimplyBook MOCK: Rescheduling mock booking');
    return {
      id: bookingId,
      date: 'Nueva fecha confirmada',
      status: 'rescheduled',
    };
  }

  throw new Error('SimplyBook real API not implemented');
}
