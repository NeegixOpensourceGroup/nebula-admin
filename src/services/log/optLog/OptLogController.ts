// 该文件由 OneAPI 自动生成，请勿手动修改！
import { request } from '@umijs/max';

export async function queryOptLogList(options?: { [key: string]: any }) {
  return request<NEBULA_API.Result>('/api/v1/optLog', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function queryOptLogById(
  id: number | string,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>('/api/v1/optLog/' + id, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function deleteOptLog(
  id: number | string,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>('/api/v1/optLog/' + id, {
    method: 'DELETE',
    ...(options || {}),
  });
}
