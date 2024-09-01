import { PageContainer } from '@ant-design/pro-components';
import { Tabs } from 'antd';
import React from 'react';
import BaseView from './components/BaseView';

const Settings: React.FC = () => {
  const menuMap: any[] = [
    {
      label: '基本设置',
      key: 'base',
      children: (
        <PageContainer
          title='基本设置'
        >
          <BaseView />
        </PageContainer>
      ),
    },

  ];

  return (
    <PageContainer
      title='个人设置'
    >
      <Tabs tabPosition="left" type="card" items={menuMap} />
    </PageContainer>
  );
};
export default Settings;
