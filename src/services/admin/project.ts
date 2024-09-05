// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';

/** 分页查询项目列表 GET /api/v1/project/list */
export async function getProjects(
  params: API.getEnvironmentsParams,
  options?: { [key: string]: any },
) {
  return request<any>('/project/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
