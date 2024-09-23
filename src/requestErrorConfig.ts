import type {RequestOptions} from '@@/plugin-request/request';
import type {RequestConfig} from '@umijs/max';
import {message as msg} from 'antd';
import {BACKEND_HOST_LOCAL, BACKEND_HOST_PROD} from "@/constan";

// 与后端约定的响应数据格式
interface ResponseStructure {
  success?: boolean;
  result?: any;
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
    // 错误抛出
    // errorThrower: (res) => {
    //   const {success, result, code, message} =
    //     res as unknown as ResponseStructure;
    //   if (!success) {
    //     const error: any = new Error(message);
    //     error.name = 'BizError';
    //     error.info = {code, message, result};
    //     throw error; // 抛出自制的错误
    //   }
    // },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。

      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const {message} = errorInfo;
          msg.error(message);
        }

      } else if (error.response) {
        if (error.message === 'Network Error') {
          msg.error(`网络开小差了, 请稍后再试！`)
          return;
        }
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        msg.error(`Response status:${error.response.status}`);


      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        msg.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        msg.error('Request error, please retry.');

      }
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
      const {data} = response as unknown as ResponseStructure;
      if (!data?.success) {
        msg.error(data.message);
      }
      return response;
    },
  ],
};
