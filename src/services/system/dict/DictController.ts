/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/v1/queryUserList */
export async function queryDictList(
  params: {
    // query
    /** keyword */
    name?: string;
    /** current */
    current?: number;
    /** pageSize */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  const { current, pageSize, ...rest } = params;
  return request<NEBULA_API.Result>(
    `/api/v1/dictGroup/${current}/${pageSize}`,
    {
      method: 'GET',
      params: rest,
      ...(options || {}),
    },
  );
}

export async function updateDict(
  body: {
    id?: number;
    name?: string;
  },
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/dictGroup/${body.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { ...body },
    ...(options || {}),
  });
}

export async function addDict(
  body: {
    id?: number;
    name?: string;
  },
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>('/api/v1/dictGroup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { ...body },
    ...(options || {}),
  });
}

export async function removeDict(
  ids: Array<number | string>,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/dictGroup`, {
    data: ids,
    method: 'DELETE',
  });
}

export async function queryDictItemList(
  params: {
    // query
    /** dictId */
    dictId?: number;
    /** name */
    name?: string;
    /** value */
    value?: string;
    /** current */
    current?: number;
    /** pageSize */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  const { current, pageSize, dictId, ...rest } = params;
  return request<NEBULA_API.Result>(
    `/api/v1/dictItem/${current}/${pageSize}/${dictId}`,
    {
      method: 'GET',
      params: rest,
      ...(options || {}),
    },
  );
}

export async function updateDictItem(
  body: {
    id?: number;
    dictId?: number;
    name?: string;
    value?: string;
  },
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(
    `/api/v1/dictItem/${body.dictId}/${body.id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { ...body },
      ...(options || {}),
    },
  );
}

export async function addDictItem(
  body: {
    id?: number;
    dictId?: number;
    name?: string;
    value?: string;
  },
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/dictItem/${body.dictId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { ...body },
    ...(options || {}),
  });
}

export async function removeDictItem(
  dictId: number,
  id: number,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/dictItem/${dictId}/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function queryDictItemByDictCode(
  code: string,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/dictItem/dictCode/${code}`, {
    method: 'GET',
    ...(options || {}),
  });
}
