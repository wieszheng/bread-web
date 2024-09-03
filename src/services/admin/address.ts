// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';

/** 获取网关列表 GET /api/v1/config/address/list */
export async function getAddressS(
  params: API.getAddressSParams,
  options?: { [key: string]: any },
) {
  return request<any>('/config/address/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新增网关 POST /api/v1/config/address */
export async function postAddress(
  body: API.AddressParams,
  options?: { [key: string]: any },
) {
  return request<any>('/config/address', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改网关 PUT /api/v1/config/address */
export async function putAddress(
  body: API.UpdateAddressParams,
  options?: { [key: string]: any },
) {
  return request<any>('/config/address', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除网关 DELETE /api/v1/config/address */
export async function deleteAddressId(
  params: API.deleteAddressIdParams,
  options?: { [key: string]: any },
) {
  return request<any>('/config/address', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
