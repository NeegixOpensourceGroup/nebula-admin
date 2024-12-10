/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/v1/queryUserList */
export async function queryBizUnitList(options?: { [key: string]: any }) {
  return request<NEBULA_API.Result>('/api/v1/bizUnit', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function queryBizUnitById(
  id: number | string,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/bizUnit/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function createBizUnit(
  body: NEBULA_API.BizUnit,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>('/api/v1/bizUnit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function updateBizUnit(
  id: number | string,
  body: NEBULA_API.BizUnit,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/bizUnit/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function deleteBizUnit(
  ids: Array<number | string>,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/bizUnit`, {
    method: 'DELETE',
    data: ids,
    ...(options || {}),
  });
}
