// 该文件由 OneAPI 自动生成，请勿手动修改！
import { request } from '@umijs/max';

export async function queryOptLogList(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  const { current, pageSize, ...rest } = params;
  return request<NEBULA_API.Result>(
    `/api/v1/operationLog/${current}/${pageSize}`,
    {
      method: 'GET',
      params: rest,
      ...(options || {}),
    },
  );
}

export async function queryOptLogById(
  id: number | string,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>('/api/v1/operationLog/' + id, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function deleteOptLog(
  id: number | string,
  options?: { [key: string]: any },
) {
  return request<NEBULA_API.Result>('/api/v1/operationLog/' + id, {
    method: 'DELETE',
    ...(options || {}),
  });
}
