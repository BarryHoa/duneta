export interface ServiceStatus { ok: true; message: string; }

export function getServiceStatus(): ServiceStatus {
  return { ok: true, message: 'Service is healthy' };
}
