import {Footer} from '@/components';
import {login} from '@/services/admin/user';
import {
  AlipayOutlined,
  LockOutlined,
  TaobaoOutlined,
  UserOutlined,
  WeiboOutlined,
} from '@ant-design/icons';
import {
  LoginFormPage,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import {history, useModel, Helmet} from '@umijs/max';
import {message, Divider, Space} from 'antd';
import React, {CSSProperties} from 'react';
import {flushSync} from 'react-dom';
import {createStyles} from 'antd-style';

const useStyles = createStyles(({token}) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});

const iconStyles: CSSProperties = {
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '18px',
  verticalAlign: 'middle',
  cursor: 'pointer',
};


const Login: React.FC = () => {

  const {initialState, setInitialState} = useModel('@@initialState');
  const {styles} = useStyles();
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const loginSuccess = async (data: API.LoginResponse, autoLogin?: boolean, popup?: boolean) => {
    if (data.code === 200 && data.success) {
      if (popup) {
        const defaultLoginSuccessMessage = '登录成功！';
        message.success(defaultLoginSuccessMessage);
      }
      //set token to localstorage
      localStorage.setItem('access_token', data?.result?.access_token || '');
      localStorage.setItem('token_type', data?.result?.token_type || '');
      localStorage.setItem('autoLogin', autoLogin?.toString() || 'false');

      await fetchUserInfo();
      const urlParams = new URL(window.location.href).searchParams;
      if (urlParams.get('redirect') === '/user/login') {
        history.push('/');
        return;
      }
      history.push(urlParams.get('redirect') || '/');
      return;
    }
  };

  const handleSubmit = async (values: API.LoginParams, autoLogin?: boolean) => {
    try {
      // 登录
      const msg = await login({
        ...values,
      });
      await loginSuccess(msg, autoLogin, true);
      // 如果失败去设置用户错误信息
      // setUserLoginState(msg);
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      message.error(defaultLoginFailureMessage);
    }
  };
  return (
    <div className={styles.container}>
      {/*<Helmet>*/}
      {/*  <title>*/}
      {/*    {'登录'}- {Settings.title}*/}
      {/*  </title>*/}
      {/*</Helmet>*/}
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginFormPage
          // backgroundImageUrl="https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png"
          logo={<img alt="logo" src="http://47.93.181.181:9000/bread/project/icon.png"/>}
          title="Bread Web"
          subTitle={'Bread Web 最具影响力的 Web 设计规范'}
          actions={
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <Divider plain>
              <span
                style={{color: '#CCC', fontWeight: 'normal', fontSize: 14}}
              >
                其他登录方式
              </span>
              </Divider>
              <Space align="center" size={24}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    height: 40,
                    width: 40,
                    border: '1px solid #D4D8DD',
                    borderRadius: '50%',
                  }}
                >
                  <AlipayOutlined style={{...iconStyles, color: '#1677FF'}}/>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    height: 40,
                    width: 40,
                    border: '1px solid #D4D8DD',
                    borderRadius: '50%',
                  }}
                >
                  <TaobaoOutlined style={{...iconStyles, color: '#FF6A10'}}/>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    height: 40,
                    width: 40,
                    border: '1px solid #D4D8DD',
                    borderRadius: '50%',
                  }}
                >
                  <WeiboOutlined style={{...iconStyles, color: '#333333'}}/>
                </div>
              </Space>
            </div>
          }
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined/>,
            }}
            placeholder={'用户名: string'}
            rules={[
              {
                required: true,
                message: '用户名是必填项！',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined/>,
            }}
            placeholder={'密码: string'}
            rules={[
              {
                required: true,
                message: '密码是必填项！',
              },
            ]}
          />
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              忘记密码 ?
            </a>
          </div>
        </LoginFormPage>
      </div>
      <Footer/>
    </div>
  );
};
export default Login;
