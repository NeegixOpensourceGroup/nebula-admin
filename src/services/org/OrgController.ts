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
  id: number,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/org/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}