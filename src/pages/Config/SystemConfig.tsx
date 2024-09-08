import React from "react";
import {PageContainer} from "@ant-design/pro-components";
import {Tabs} from "antd";
import EmailConfig from "@/pages/Config/components/EmailConfig";

const SystemConfig: React.FC = () => {
  const menuMap: any[] = [
    {
      label: '邮件设置',
      key: 'email',
      children: (
        <PageContainer
          header={{
            title: '邮件设置',
            breadcrumb: {},
          }}
        >
          <EmailConfig />
        </PageContainer>
      ),
    },
    {
      label: 'Minio设置',
      key: 'minio',
      children: (
        <PageContainer
          header={{
            title: 'Minio设置',
            breadcrumb: {},
          }}
        >
        </PageContainer>
      ),
    },
  ];
  return <PageContainer
    header={{
      title: '系统设置',
      breadcrumb: {},
    }}>
    <Tabs tabPosition="left" type="card" items={menuMap} />
  </PageContainer>
}
export default SystemConfig;
