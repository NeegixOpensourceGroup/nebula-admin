/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/v1/queryUserList */
export async function queryDeptList(
  bizUnitId: number|string,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/dept/bizUnit/${bizUnitId}`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function queryDeptById(
  id: number|string,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/dept/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function createDept(
  bizUnitId: number|string,
  body: NEBULA_API.Dept,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/dept/bizUnit/${bizUnitId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}


export async function updateDept(
  id: number|string,
  body: NEBULA_API.Dept,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/dept/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options ||{}),
  })
}

export async function deleteDept(
  id: number|string,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/dept/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
