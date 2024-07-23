import { request } from '@umijs/max';

export async function queryAccess(
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>('/api/v1/access', {
    method: 'GET',
    ...(options || {}),
  })
}