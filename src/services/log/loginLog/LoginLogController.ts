// 该文件由 OneAPI 自动生成，请勿手动修改！
import { request } from '@umijs/max';

export async function queryLoginLogList(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  const { current, pageSize, ...rest } = params;
  return request<NEBULA_API.Result>(`/api/v1/loginLog/${current}/${pageSize}`, {
    method: 'GET',
    params: rest,
    ...(options || {}),
  });
}

export async function queryLoginLogById(
  id: number | string,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>('/api/v1/loginLog/' + id, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function deleteLoginLog(
  id: number | string,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>('/api/v1/loginLog/' + id, {
    method: 'DELETE',
    ...(options || {}),
  });
}
