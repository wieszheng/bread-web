import type {RequestOptions} from '@@/plugin-request/request';
import type {RequestConfig} from '@umijs/max';
import {message, notification} from 'antd';
import {BACKEND_HOST_LOCAL} from "@/constan";

// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  result: any;
  code?: number;
  message?: string;
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  baseURL: BACKEND_HOST_LOCAL,

  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      // 我们的 errorThrower 抛出的错误。
      console.log(error)

      // localStorage.clear()
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 拦截请求配置，进行个性化处理。
      const access_token = localStorage.getItem('access_token');
      const token_type = localStorage.getItem('token_type');
      const headers = {
        Authorization: `${token_type} ${access_token}`,
      };
      return {...config, headers};
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response as unknown as ResponseStructure;

      if (!data?.success) {
        message.error(data.message);
      }
      return response;
    },
  ],
};
