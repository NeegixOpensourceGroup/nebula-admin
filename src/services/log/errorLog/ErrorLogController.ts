// 该文件由 OneAPI 自动生成，请勿手动修改！
import { request } from '@umijs/max';

export async function queryErrorLogList(options?: { [key: string]: any }) {
  return request<NEBULA_API.Result>('/api/v1/errorLog', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function queryErrorLogById(
  id: number | string,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>('/api/v1/errorLog/' + id, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function deleteErrorLog(
  id: number | string,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>('/api/v1/errorLog/' + id, {
    method: 'DELETE',
    ...(options || {}),
  });
}
