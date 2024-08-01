import { request } from '@umijs/max';

export async function queryRoleList(
  params: {
    /** current */
    current?: number;
    /** pageSize */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>('/api/v1/role', {
    method: 'GET',
    params: {
     ...params,
    },
    ...(options || {}),
  })
}

export async function createRole(
  body: any,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>('/api/v1/role', {
    method: 'POST',
    data: body,
    ...(options || {}),
  })
}

export async function updateRole(
  id: number|string,
  body: any,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/role/${id}`, {
    method: 'PUT',
    data: body,
    ...(options || {}),
  })
}

export async function deleteRole(
  id: number|string,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/role/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  })
}

export async function getRole(
  id: number|string,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/role/${id}`, {
    method: 'GET',
    ...(options || {}),
  })
}