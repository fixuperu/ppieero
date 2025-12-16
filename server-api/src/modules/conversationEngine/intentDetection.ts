import { ConversationState } from '@prisma/client';

type Intent = 'book' | 'reschedule' | 'cancel' | 'info' | 'human' | 'unknown';

const INTENT_PATTERNS: Record<Intent, RegExp[]> = {
  book: [
    /\b(agendar|reservar|cita|appointment|book|quiero|necesito)\b/i,
    /\b(horario|disponible|disponibilidad)\b/i,
  ],
  reschedule: [
    /\b(reagendar|cambiar|mover|reschedule|modificar)\b/i,
    /\b(otra fecha|otro horario|diferente)\b/i,
  ],
  cancel: [
    /\b(cancelar|cancel|eliminar|borrar|quitar)\b/i,
    /\b(no puedo|no voy|ya no)\b/i,
  ],
  info: [
    /\b(información|info|precio|costo|cuanto|donde|dirección|horario de atención)\b/i,
    /\b(qué servicios|que ofrecen|políticas)\b/i,
  ],
  human: [
    /\b(humano|persona|agente|operador|hablar con alguien)\b/i,
    /\b(no entiendes|no me entiendes|ayuda real)\b/i,
  ],
  unknown: [],
};

export async function detectIntent(text: string, currentState: ConversationState): Promise<Intent> {
  // Check each intent pattern
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    if (intent === 'unknown') continue;
    
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        return intent as Intent;
      }
    }
  }

  // Context-based defaults based on current state
  switch (currentState) {
    case 'NEW':
      return 'unknown';
    case 'NEED_SERVICE':
    case 'NEED_DATE_PREF':
    case 'PROPOSE_SLOTS':
    case 'NEED_CONFIRM_SLOT':
      // In the middle of a booking flow, assume continuation
      return 'book';
    default:
      return 'unknown';
  }
}
