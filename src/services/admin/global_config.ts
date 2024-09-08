// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';

/** 获取全局变量列表 GET /api/v1/config/global_config/list */
export async function getGlobalConfigs(
  params: API.getGlobalConfigsParams,
  options?: { [key: string]: any },
) {
  return request<any>('/config/global_config/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新增全局变量 POST /api/v1/config/global_config */
export async function postGlobalConfig(
  body: API.GlobalConfigParams,
  options?: { [key: string]: any },
) {
  return request<any>('/config/global_config', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改全局变量 PUT /api/v1/config/global_config */
export async function putGlobalConfig(
  body: API.putGlobalConfigParams,
  options?: { [key: string]: any },
) {
  return request<any>('/config/global_config', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除全局变量 DELETE /api/v1/config/global_config */
export async function deleteGlobalConfigId(
  params: API.deleteGlobalConfigIdParams,
  options?: { [key: string]: any },
) {
  return request<any>('/config/global_config', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
