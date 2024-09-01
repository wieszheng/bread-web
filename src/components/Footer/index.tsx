import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      links={[
        // {
        //   key: 'bread',
        //   title: 'bread',
        //   href: 'https://github.com/wieszheng/bread',
        //   blankTarget: true,
        // },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/wieszheng/bread',
          blankTarget: true,
        },
        {
          key: 'bread-web',
          title: 'wieszheng',
          href: 'https://github.com/wieszheng/bread',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
