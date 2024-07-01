import { RunTimeLayoutConfig } from '@umijs/max';
import { history, RequestConfig } from 'umi';
import { message } from 'antd';
import services from '@/services/auth';

const { logout } = services.AuthController;


// 运行时配置
// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name?: string, token?: string }> {
  const name = sessionStorage.getItem("name");
  if (name === null) {
    // 处理null值的情况，可能是抛出错误或返回默认值
    throw new Error("initialState is null");
  } else {
    return { name };
  }
}

export const layout: RunTimeLayoutConfig = () => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    layout: 'mix',
    splitMenus: true,
    async logout() {
      const res = await logout();
      if (res.status === 200) {
        message.open({
          content: '退出成功',
          type: 'success',
          duration: 1,
          onClose: () => {
            sessionStorage.removeItem("token");
            history.push("/login");
          },
        });
      }
    },

  };
};

export const request: RequestConfig = {
  timeout: 30000,
  // other axios options you want
  errorConfig: {  // =======统一的错误处理方案=======
    errorHandler(){
    },
    errorThrower(){
    }
  },
  requestInterceptors: [  // =======为request方法添加请求阶段的拦截器=======
		// 直接写一个 function，作为拦截器
    (url, options) =>
      {
        if (sessionStorage.getItem("token") !== null) {
          options.headers = {
            ...options.headers,
            Authorization: sessionStorage.getItem("token")??""
          }
        } else {
          history.push("/login");
        }
        // do something
        return { url, options }
      },
    // 一个二元组，第一个元素是 request 拦截器，第二个元素是错误处理
    [(url, options) => {return { url, options }}, (error) => {return Promise.reject(error)}],
    // 数组，省略错误处理
    [(url, options) => {return { url, options }}]
	],
  responseInterceptors: [ // =======为request方法添加响应阶段的拦截器=======
		// 直接写一个 function，作为拦截器
    (response) =>
      {
        // 不再需要异步处理读取返回体内容，可直接在data中读出，部分字段可在 config 中找到
        const { data = {} as any } = response;
        if (data.code === 504 || data.code === 500) {
          return Promise.reject(data);
        }
        // do something
        return response
      },
    // 一个二元组，第一个元素是 request 拦截器，第二个元素是错误处理
    [(response) => {return response}, (error: any) => {
      const { response } = error;
      debugger
      if (response.status === 401) {
        message.open({
          content: '登录失效，请重新登录',
          type: 'error',
          duration: 1,
          onClose: () => {
            sessionStorage.removeItem("token");
            history.push("/login");
          },
        });
      }

      if (response.status === 504) {
        message.open({
          content: '服务器异常',
          type: 'error',
          duration: 1,
        });
      }
      // if (response.status !== 200) {
      //   message.error(response.data.message);
      // }
      return Promise.reject(error)
    }],
    // 数组，省略错误处理
    [(response) => {return response}]
	]
};
