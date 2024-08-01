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
  return request<NEBULA_API.Result>('/api/v1/dict', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function updateDict(
  body: {
    id?: number;
    name?: string;
  },
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/dict/${body.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { ...body},
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
  return request<NEBULA_API.Result>('/api/v1/dict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { ...body},
    ...(options || {}),
  });
}

export async function removeDict(id: number, options?: { [key: string]: any }){
  return request<NEBULA_API.Result>(`/api/v1/dict/${id}`, {
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
  return request<NEBULA_API.Result>(`/api/v1/dictItem/${params.dictId}`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
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
  return request<NEBULA_API.Result>(`/api/v1/dictItem/${body.dictId}/${body.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { ...body},
    ...(options || {}),
  });
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
    data: { ...body},
    ...(options || {}),
  });
}

export async function removeDictItem(dictId: number, id: number, options?: { [key: string]: any }){
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
  })
}