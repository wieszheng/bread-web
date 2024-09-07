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

/** 查询项目 GET /api/v1/project */
export async function getProject(
  params: API.getProjectIdParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResponse>('/project', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新增项目 POST /api/v1/project */
export async function postProject(
  body: API.ProjectParams,
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
  body: API.putProjectsParams,
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

/** 修改项目头像 PUT /api/v1/project/avatar/${param0} */
export async function putProjectAvatar(
  project_id: number,
  data: FormData,
  options?: { [key: string]: any },
) {
  return request<API.CommonResponse>(`/project/avatar/${project_id}`, {
    method: 'PUT',
    data: data,
    ...(options || {}),
  });
}

/** 删除项目 DELETE /api/v1/project */
export async function deleteProjectId(
  params: API.deleteProjectIdParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResponse>('/project', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新增角色 POST /api/v1/project/role */
export async function postProjectRole(
  body: API.ProjectRoleParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResponse>('/project/role', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改角色 PUT /api/v1/project/role */
export async function putProjectRole(
  body: API.putProjectRoleParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResponse>('/project/role', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除角色 DELETE /api/v1/project/role */
export async function deleteProjectRoleId(
  params: API.deleteProjectRoleIdParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResponse>('/project/role', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
