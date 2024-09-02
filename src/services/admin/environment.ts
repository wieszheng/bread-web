// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';

/** 获取环境列表 GET /api/v1/config/environment/list */
export async function getEnvironments(
  params: API.getEnvironmentsParams,
  options?: { [key: string]: any },
) {
  return request<any>('/config/environment/list', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
