﻿import type {RequestOptions} from '@@/plugin-request/request';
import type {RequestConfig} from '@umijs/max';
import {message as tip, notification} from 'antd';

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
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      const {success, result, code, message} =
        res as unknown as ResponseStructure;
      if (!success) {

        const error: any = new Error(message);
        error.name = 'BizError';
        error.info = {code, message, result};
        tip.error(message)
        // throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const {message, code} = errorInfo;
          notification.error({description: code, message: message})
          // tip.error(message);
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        tip.error(`Response status:${error.response.status}`);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        tip.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        tip.error('Request error, please retry.');
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 拦截请求配置，进行个性化处理。
      const access_token = localStorage.getItem('access_token');
      const token_type = localStorage.getItem('token_type');
      if (access_token && token_type) {
        const headers = {
          Authorization: `${token_type} ${access_token}`,
        };

        return {...config, headers};
      }
      return {...config};
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const {result} = response as unknown as ResponseStructure;

      if (result?.success === false) {
        tip.error('请求失败！');
      }
      return response;
    },
  ],
};
