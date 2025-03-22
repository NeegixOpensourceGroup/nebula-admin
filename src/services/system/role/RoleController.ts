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
  const { current, pageSize, ...rest } = params;
  return request<NEBULA_API.Result>(`/api/v1/role/${current}/${pageSize}`, {
    method: 'GET',
    params: rest,
    ...(options || {}),
  });
}

export async function queryAllRole(options?: { [key: string]: any }) {
  return request<NEBULA_API.Result>(`/api/v1/role`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function createRole(body: any, options?: { [key: string]: any }) {
  return request<NEBULA_API.Result>('/api/v1/role', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function updateRole(
  id: number | string,
  body: any,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/role/${id}`, {
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
}

export async function deleteRole(
  ids: Array<number | string>,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/role`, {
    method: 'DELETE',
    data: ids,
    ...(options || {}),
  });
}

export async function getRole(
  id: number | string,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/role/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}
