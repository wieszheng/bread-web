// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CommonResponse<T = any> = {
    success?: boolean;
    code?: number;
    message?: string;
    result?: T;
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

  type CurrentEnvironment = {
    /** id */
    id: string;
    /** name */
    name: string;
    /** remarks */
    remarks: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    is_deleted: boolean;
    created_by: number;
    updated_by: string | null;
    user_username: string;
    user_nickname: string;
    user_email: string | null;
    user_phone: string | null;
    user_avatar: string | null;

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


  type getEnvironmentsParams = {
    /** current */
    current?: number;
    /** pageSize */
    pageSize?: number;
    /** name */
    name?: string;
  };
  type EnvironmentParams = {
    name?: string;
    remarks?: string;
  }
  type UpdateEnvironmentParams = {
    id?: number;
    name?: string;
    remarks?: string;
  }
  type deleteEnvironmentIdParams = {
    /** env_id */
    env_id: string;
  }


  type getAddressSParams = {
    /** current */
    current?: number;
    /** pageSize */
    pageSize?: number;
    /** name */
    name?: string;
    /** env */
    env?: string;
  };
  type AddressParams = {
    env?: string;
    name?: string;
  }
  type UpdateAddressParams = {
    id?: number;
    env?: string;
    name?: string;
    gateway?: string;
  }
  type deleteAddressIdParams = {
    /** address_id */
    address_id: number;
  };

  type deleteProjectIdParams = {
    /** project_id */
    project_id: number;
  };

  type deleteProjectRoleIdParams = {
    /** role_id  */
    role_id: number;
  };

  type putProjectRoleParams = {
    /** id  */
    id?: number;
    /** user_id  */
    user_id: number;
    /** project_role  */
    project_role: number;
    /** project_id  */
    project_id: number;
  }

  type ProjectRoleParams = {
    /** user_id  */
    user_id?: number;
    /** project_role  */
    project_role?: number;
    /** project_id  */
    project_id: number;
  }

  type getProjectIdParams = {
    /** project_id */
    project_id: number;
  };

  type AssociatedUser = {
    user_username: string;
    user_nickname: string;
    user_email: string | null;
    user_phone: string | null;
    user_avatar: string | null;
  }
  type CurrentAddress = {
    /** id */
    id: number;
    /** env */
    env: number;
    /** name */
    name: string;
    /** gateway */
    gateway: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    is_deleted: boolean;
    created_by: number;
    updated_by: string | null;
    user_username: string;
    user_nickname: string;
    user_email: string | null;
    user_phone: string | null;
    user_avatar: string | null;

  };

  type getProjectsParams = {
    /** current */
    current?: number;
    /** pageSize */
    pageSize?: number;
  }

  type ProjectParams = {
    name?: string;
    app?: string;
    owner?: number;
    private?: boolean;
    description?: string
    dingtalk_url?: string
  }

  type putProjectsParams = {
    id?: number;
    name?: string;
    app?: string;
    owner?: number;
    private?: boolean;
    description?: string
    dingtalk_url?: string
  }

  type getGlobalConfigsParams = {
    /** current */
    current?: number;
    /** pageSize */
    pageSize?: number;
    /** key */
    key?: string;
    /** env */
    env?: string;
  }

  type GlobalConfigParams = {
    key?: string;
    value?: string;
    env?: number;
    key_type?: number;
    enable?: boolean
  }

  type putGlobalConfigParams = {
    id?: number;
    key?: string;
    value?: string;
    env?: number;
    key_type?: number;
    enable?: boolean
  }

  type deleteGlobalConfigIdParams = {
    /** global_id  */
    global_id: number;
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


  type LoginParams = {
    username?: string;
    password?: string;
  };

  ;
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
  type getListTestcaseTreeParams = {
    /** project_id */
    project_id: number;
    /** move */
    move?: boolean;
  };
}
