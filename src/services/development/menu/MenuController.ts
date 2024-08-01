import { request } from '@umijs/max';

export async function queryMenuList(
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>('/api/v1/menu', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function queryMenuById(
  id: number|string,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/menu/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function createMenu(
  body: any,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>('/api/v1/menu', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function updateMenu(
  id: number,
  body: any,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/menu/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function deleteMenu(
  id: number|string,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/menu/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}