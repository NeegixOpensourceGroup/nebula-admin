/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/v1/queryUserList */
export async function queryUserList(
  params: {
    // query
    /** keyword */
    keyword?: string;
    /** current */
    current?: number;
    /** pageSize */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.Result_PageInfo_UserInfo__>('/api/v1/queryUserList', {
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
  return request<NEBULA_API.Result>('/api/v1/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/v1/user/${param0} */
export async function getPsnDetail(
  userId?: string|number,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/user/${userId}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /api/v1/user/${param0} */
export async function updatePsn(
  userId?: string|number,
  body?: API.PsnInfoVO,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/user/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /api/v1/user/${param0} */
export async function deletePsn(
  userId?: string|number,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/user/${userId}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
