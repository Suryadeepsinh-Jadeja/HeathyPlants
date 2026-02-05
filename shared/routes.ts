import { z } from 'zod';
import { insertScanSchema, scans } from './schema';

export const api = {
  scans: {
    list: {
      method: 'GET' as const,
      path: '/api/scans',
      responses: {
        200: z.array(z.custom<typeof scans.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/scans',
      input: insertScanSchema,
      responses: {
        201: z.custom<typeof scans.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
  },
};

// Helper to build URLs
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
