/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/v1/queryUserList */
export async function queryOrgList(
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>('/api/v1/org', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function queryOrgById(
  id: number|string,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/org/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function createOrg(
  body: NEBULA_API.Org,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>('/api/v1/org', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}


export async function updateOrg(
  id: number|string,
  body: NEBULA_API.Org,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/org/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options ||{}),
  })
}

export async function deleteOrg(
  id: number|string,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/org/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
