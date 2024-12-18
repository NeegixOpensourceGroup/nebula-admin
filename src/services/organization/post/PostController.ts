/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！
import { request } from '@umijs/max';

export async function queryPostList(
  params: any,
  options?: { [key: string]: any },
) {
  const { current, pageSize, ...rest } = params;
  return request<NEBULA_API.Result>(`/api/v1/post/${current}/${pageSize}`, {
    method: 'GET',
    params: rest,
    ...(options || {}),
  });
}

export async function queryPostDetail(
  id: string | number,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/post/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function addPost(body: any, options?: { [key: string]: any }) {
  return request<NEBULA_API.Result>('/api/v1/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function updatePost(
  id: string | number,
  body: any,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/post/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function deletePost(
  ids: Array<any>,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>(`/api/v1/post`, {
    method: 'DELETE',
    data: ids,
    ...(options || {}),
  });
}
