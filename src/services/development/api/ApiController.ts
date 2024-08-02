import { request } from '@umijs/max';

export async function queryApiList(options?: { [key: string]: any }) {
  return request<NEBULA_API.Result>('/api/v1/api', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function queryApiById(
  id: number | string,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/api/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function createApi(body: any, options?: { [key: string]: any }) {
  return request<NEBULA_API.Result>('/api/v1/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function updateApi(
  id: number | string,
  body: any,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/api/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function deleteApi(
  id: number | string,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/api/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
