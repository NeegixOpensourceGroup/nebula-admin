// 该文件由 OneAPI 自动生成，请勿手动修改！
import { request } from '@umijs/max';

export async function queryExceptionLogList(options?: { [key: string]: any }) {
  return request<NEBULA_API.Result>('/api/v1/exceptionLog', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function queryExceptionLogById(
  id: number | string,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>('/api/v1/exceptionLog/' + id, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function deleteExceptionLog(
  id: number | string,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>('/api/v1/exceptionLog/' + id, {
    method: 'DELETE',
    ...(options || {}),
  });
}