import { request } from '@umijs/max';

export async function login(
  body?: FormData,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>('/api/v1/login', {
    method: 'POST',
    getResponse: true,
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function logout(
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>('/api/v1/logout', {
    method: 'POST',
    getResponse: true,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}