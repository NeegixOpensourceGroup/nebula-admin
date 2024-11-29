import { request } from '@umijs/max';

export async function queryApiList(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  const { current, pageSize, ...rest } = params;
  return request<NEBULA_API.Result>(`/api/v1/api/${current}/${pageSize}`, {
    method: 'GET',
    params: rest,
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
  ids: Array<number | string>,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/api`, {
    method: 'DELETE',
    data: ids,
    ...(options || {}),
  });
}
