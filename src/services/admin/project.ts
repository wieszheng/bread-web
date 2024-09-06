// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';
import {deleteAddressId, postAddress} from "@/services/admin/address";

/** 分页查询项目列表 GET /api/v1/project/list */
export async function getProjects(
  params: API.getProjectsParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResponse>('/project/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新增项目 POST /api/v1/project */
export async function postProject(
  body: API.ProjectsParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResponse>('/project', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改项目 PUT /api/v1/project */
export async function putProject(
  body: API.ProjectsParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResponse>('/project', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除项目 DELETE /api/v1/project */
export async function deleteProject(
  body: API.ProjectsParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResponse>('/project', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
