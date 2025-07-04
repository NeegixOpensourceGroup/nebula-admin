import { GiteeFilled } from '@/icons/GiteeFilled';
import accessServices from '@/services/system/access';
import services from '@/services/system/auth';
import { GithubFilled, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { FormattedMessage, RunTimeLayoutConfig, SelectLang } from '@umijs/max';
import { Dropdown, message } from 'antd';
import { history, RequestConfig } from 'umi';
import logo from '/public/images/logo.svg';

const { queryAccess } = accessServices.AccessController;
const { logout } = services.AuthController;

// 运行时配置
// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{
  name?: string;
  token?: string;
  access?: any;
}> {
  const name = sessionStorage.getItem('name');
  if (name === null) {
    // 处理null值的情况，可能是抛出错误或返回默认值
    throw new Error('initialState is null');
  } else {
    const res = await queryAccess();
    return { name, access: res.data };
  }
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    logo,
    menu: {
      locale: false,
    },
    layout: 'mix',
    splitMenus: true,
    avatarProps: {
      src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
      size: 'small',
      title: initialState?.name,
      render: (props, dom) => {
        return (
          <Dropdown
            menu={{
              items: [
                {
                  key: 'psn',
                  icon: <UserOutlined />,
                  label: <FormattedMessage id="layout.header.profile" />,
                  onClick: () => {
                    history.push('/personal/profile');
                  },
                },
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: <FormattedMessage id="layout.header.logout" />,
                  onClick: async () => {
                    const res = await logout();
                    if (res.status === 200) {
                      message.open({
                        content: '退出成功',
                        type: 'success',
                        duration: 1,
                        onClose: () => {
                          sessionStorage.removeItem('token');
                          sessionStorage.removeItem('name');
                          history.push('/login');
                        },
                      });
                    }
                  },
                },
              ],
            }}
          >
            {dom}
          </Dropdown>
        );
      },
    },
    actionsRender: (props) => {
      if (props.isMobile) return [];
      if (typeof window === 'undefined') return [];
      return [
        <GiteeFilled
          key="GiteeFilled"
          onClick={() => {
            window.open(
              'https://gitee.com/neegix-opensource-group/nebula-admin',
            );
          }}
        />,
        <GithubFilled
          key="GithubFilled"
          onClick={() => {
            window.open(
              'https://github.com/NeegixOpensourceGroup/nebula-admin',
            );
          }}
        />,
        <SelectLang key={'SelectLang'} />,
      ];
    },
  };
};

export const request: RequestConfig = {
  timeout: 30000,
  // other axios options you want
  errorConfig: {
    // =======统一的错误处理方案=======
    errorHandler() {},
    errorThrower() {},
  },
  requestInterceptors: [
    // =======为request方法添加请求阶段的拦截器=======
    // 直接写一个 function，作为拦截器
    (url, options) => {
      if (sessionStorage.getItem('token') !== null) {
        // 获取时区（如 "Asia/Shanghai"）
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        options.headers = {
          ...options.headers,
          Authorization: sessionStorage.getItem('token') ?? '',
          'X-Timezone': timezone,
        };
      } else {
        history.push('/login');
      }
      // do something
      return { url, options };
    },
    // 一个二元组，第一个元素是 request 拦截器，第二个元素是错误处理
    [
      (url, options) => {
        return { url, options };
      },
      (error) => {
        return Promise.reject(error);
      },
    ],
    // 数组，省略错误处理
    [
      (url, options) => {
        return { url, options };
      },
    ],
  ],
  responseInterceptors: [
    // =======为request方法添加响应阶段的拦截器=======
    // 直接写一个 function，作为拦截器
    (response) => {
      // 不再需要异步处理读取返回体内容，可直接在data中读出，部分字段可在 config 中找到
      const { data = {} as any } = response;
      if (data.code !== 200) {
        return Promise.reject(data);
      }
      // do something
      return response;
    },
    // 一个二元组，第一个元素是 request 拦截器，第二个元素是错误处理
    [
      (response) => {
        return response;
      },
      (error: any) => {
        let result = error;
        if (error.response) {
          if (error.response.status === 504) {
            result = {
              code: 504,
              message: '服务器异常',
            };
          } else {
            result = error.response.data;
          }
        }
        const { code, message: errorMessage } = result;
        if (code === 500 || code === 405) {
          message.open({
            content: errorMessage,
            type: 'error',
            duration: 1,
          });
        }

        if (code === 401) {
          message.open({
            content: errorMessage,
            type: 'error',
            duration: 1,
            onClose: () => {
              sessionStorage.removeItem('token');
              sessionStorage.removeItem('name');
              history.push('/login');
            },
          });
        }

        if (code === 403) {
          message.open({
            content: errorMessage,
            type: 'error',
            duration: 1,
            onClose: () => {
              //sessionStorage.removeItem('token');
              //sessionStorage.removeItem('name');
              //history.push('/login');
            },
          });
        }

        if (code > 500 && code < 600) {
          message.open({
            content: result.message,
            type: 'error',
            duration: 1,
          });
        }
        // if (response.status !== 200) {
        //   message.error(response.data.message);
        // }
        return Promise.reject(error);
      },
    ],
    // 数组，省略错误处理
    [
      (response) => {
        return response;
      },
    ],
  ],
};
