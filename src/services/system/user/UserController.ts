import { request } from '@umijs/max';

export async function queryUserList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  const { current, pageSize, ...rest } = params;
  return request<NEBULA_API.Result>(`/api/v1/user/${current}/${pageSize}`, {
    method: 'GET',
    params: rest,
    ...(options || {}),
  });
}

export async function queryUserDetail(
  id: number | string,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/user/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function createUser(body: any, options?: { [key: string]: any }) {
  return request<NEBULA_API.Result>('/api/v1/user', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function updateUser(
  id: number | string,
  body: any,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/user/${id}`, {
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
}

export async function deleteUser(
  ids: Array<number | string>,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/user`, {
    method: 'DELETE',
    data: ids,
    ...(options || {}),
  });
}

export async function bindRole(body: any, options?: { [key: string]: any }) {
  return request<NEBULA_API.Result>('/api/v1/user/bindRoles', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function queryRolesByUser(
  pkUser: number | string,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/user/${pkUser}/roles`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function modifyPassword(
  body: any,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>('/api/v1/user/password', {
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
}
