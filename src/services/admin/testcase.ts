// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';

/** GET /api/v1/testcase/directory */
export async function getListTestcaseDirectory(
  params: API.getListTestcaseDirectoryParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResponse>('/testcase/directory', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** POST /api/v1/testcase/directory */
export async function postTestcaseDirectory(
  body: API.postTestcaseDirectoryParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResponse>('/testcase/directory', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** PUT /api/v1/testcase/directory */
export async function putTestcaseDirectory(
  body: API.putTestcaseDirectoryParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResponse>('/testcase/directory', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** DELETE /api/v1/testcase/directory */
export async function deleteTestcaseDirectory(
  params: API.deleteTestcaseDirectoryParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResponse>('/testcase/directory', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
