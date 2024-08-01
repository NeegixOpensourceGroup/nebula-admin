/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/v1/psn */
export async function queryPsnList(
  params: any,
  options?: { [key: string]: any },
) {
  return request<API.Result_PageInfo_UserInfo__>('/api/v1/psn', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/user */
export async function addPsn(
  body?: API.PsnInfoVO,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>('/api/v1/psn', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/v1/psn/${param0} */
export async function getPsnDetail(
  userId?: string|number,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/psn/${userId}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /api/v1/psn/${param0} */
export async function updatePsn(
  userId?: string|number,
  body?: API.PsnInfoVO,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/psn/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /api/v1/psn/${param0} */
export async function deletePsn(
  userId?: string|number,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/psn/${userId}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
