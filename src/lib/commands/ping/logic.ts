import type { PingResult } from './types';

export class PingLogic {
  /**
   * Calculate bot latency
   */
  static calculateLatency(messageTimestamp: number, interactionTimestamp: number): number {
    return messageTimestamp - interactionTimestamp;
  }

  /**
   * Format ping response message
   */
  static formatResponse(result: PingResult, language: string = 'en-US'): string {
    const translations = {
      'en-US': {
        title: '🏓 Pong!',
        latency: '📡 Latency',
        apiLatency: '💓 API Latency'
      },
      'es-ES': {
        title: '🏓 ¡Pong!',
        latency: '📡 Latencia',
        apiLatency: '💓 Latencia API'
      }
    };

    const t = translations[language as keyof typeof translations] || translations['en-US'];

    return [t.title, `${t.latency}: **${result.latency}ms**`, `${t.apiLatency}: **${result.apiLatency}ms**`].join('\n');
  }

  /**
   * Get ping status emoji based on latency
   */
  static getStatusEmoji(latency: number): string {
    if (latency < 100) return '🟢';
    if (latency < 200) return '🟡';
    return '🔴';
  }
}
