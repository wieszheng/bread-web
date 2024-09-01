// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CommonResponse<T = any> = {
    success?: boolean;
    code?: number;
    message?: string;
    result?: T;
  };

  type Page = {
    current?: number;
    pageSize?: number;
    total?: number;
  };
  type CurrentUser = {
    nickname?: string;
    username?: string;
    avatar?: string;
    id?: string;
    email?: string;
    role?: number;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    access?: string;
    address?: string;
    phone?: string;
  };

  type LoginResponse = CommonResponse<{
    data?: any;
    access_token?: string;
    token_type?: string;
  }>;

  type PageParams = {
    current?: number;
    pageSize?: number;
  };
  type UpdateUserParam = {
    /** Username */
    username: string;
    /** Nickname */
    nickname: string;
    /** Email */
    email: string;
    /** Phone */
    phone?: string | null;
    /** Avatar */
    avatar?: string | null;
  };

  type UpdateUserStateParam = {
    /** id */
    id: string;
    /** is_valid */
    is_valid: boolean;
  };

  type UpdateUserRoleParam = {
    /** id */
    id: string;
    /** role */
    role: number;
    /** username */
    username: string;
    /** email */
    email: string;
  };

  type getUsersIdParams = {
    /** id */
    id: string;
  };
  type getUsersParams = {
    /** current */
    current?: number;
    /** pageSize */
    pageSize?: number;
    /** id */
    id?: string;
    /** name */
    name?: string;
  };

  type deleteUsersIdParams = {
    /** id */
    id: string;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}
