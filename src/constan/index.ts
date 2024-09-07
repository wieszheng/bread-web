/**
 * 本地后端地址
 */
export const BACKEND_HOST_LOCAL: string = 'http://127.0.0.1:9099/api/v1';

/**
 * 线上后端地址
 */
export const BACKEND_HOST_PROD: string = 'http://47.93.181.181:9099/api/v1';


export const formItemLayout = {
  labelCol: {span: 4},
  wrapperCol: {span: 19},
}

export const PROJECT_AVATAR_URL: string = 'http://82.157.176.120:8000/bread/6/451e2ec956bc446ebe3acc72d2a1bf51.jpg'
export const USER_AVATAR_URL: string = 'https://api.dicebear.com/7.x/miniavs/svg?seed=1'

export const PROJECT_ROLE_MAP: Record<number, string> = {
  1: '组长',
  0: '组员',
  // 2: "负责人"
}
