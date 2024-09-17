// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';
/** GET /api/v1/testcase/directory */
export async function getListTestcaseTree(
  params: API.getListTestcaseTreeParams,
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
