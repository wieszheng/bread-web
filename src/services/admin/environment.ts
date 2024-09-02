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

/** 新增环境 POST /api/v1/config/environment */
export async function postEnvironment(
  body: API.EnvironmentParams,
  options?: { [key: string]: any },
) {
  return request<any>('/config/environment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改环境 PUT /api/v1/config/environment */
export async function putEnvironment(
  body: API.UpdateEnvironmentParams,
  options?: { [key: string]: any },
) {
  return request<any>('/config/environment', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改环境 PUT /api/v1/config/environment */
export async function deleteEnvironmentId(
  params: API.deleteEnvironmentIdParams,
  options?: { [key: string]: any },
) {
  return request<any>('/config/environment', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
