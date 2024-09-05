import React, {useRef, useState} from "react";
import {ActionType, PageContainer} from "@ant-design/pro-components";
import {Avatar, Button, Tag, Tooltip} from "antd";
import {
  MessageOutlined,

  QuestionCircleOutlined,
} from "@ant-design/icons";

import {getProjects} from "@/services/admin/project";

import {history} from '@umijs/max';
import ProList from "@ant-design/pro-list/lib";

const IconText = ({icon, text}: { icon: any; text: string }) => (
  <span>
    {React.createElement(icon, {style: {marginInlineEnd: 8}})}
    {text}
  </span>
);
const Project: React.FC = () => {
  const [activeKey, setActiveKey] = useState<React.Key | undefined>('tab1');
  const action = useRef<ActionType>();
  return <PageContainer
    header={{
      title: '项目管理',
      breadcrumb: {},
    }}
  >
    <ProList<any>
      size={'large'}
      // toolbar={() => {
      //   return [

      //   ];
      // }}
      actionRef={action}
      toolbar={{
        menu: {
          activeKey,

          items: [
            {
              key: 'tab1',
              label: (
                <span>全部项目</span>
              ),
            },
            {
              key: 'tab2',
              label: (
                <span>
                  我加入的项目
                </span>
              ),
            },
          ],
          onChange(key) {
            setActiveKey(key);
          },
        },
        search: {
          onSearch: (value: string) => {
            alert(value);
          },
          placeholder: "请输入项目名称",
        },
        actions: [
          <Button key="3" type="primary" onClick={() => {
            console.log('新建项目')
          }}
          >
            创建项目
            <Tooltip title="只有超级管理员可以创建项目">
              <QuestionCircleOutlined/>
            </Tooltip>
          </Button>,
        ],
      }}
      ghost={true}
      pagination={{
        defaultPageSize: 12,
        showSizeChanger: false,
      }}
      showActions="hover"
      // rowSelection={{}}
      rowKey="name"
      grid={{gutter: 14, column: 4}}
      onItem={(record: any) => {
        return {
          onMouseEnter: () => {
            console.log(record);
          },
          onClick: () => {
            console.log(record);
            history.push(`/project/${record.id}`);
          },
        };
      }}
      metas={{
        avatar: {
          dataIndex: 'avatar',
          render: (_, row) => {
            return <Avatar shape={'square'} src={row.avatar}/>
          },
          search: false,
        },
        title: {
          dataIndex: 'name',
          render: (_, row) => {
            return <h3 style={{color: '#000', marginLeft: 8}}>{row.name}</h3>
          },
        },
        subTitle: {
          render: (_, row) => {
            return <Tag color="blue">{row.user_nickname}</Tag>
          },
        },
        type: {},
        content: {
          render: (_, row) => {
            return <div style={{flex: 1,}}>
              <div
                style={{
                  width: 'auto',
                }}
              >
                <div
                  style={{
                    marginBottom: 4,
                    fontWeight: 'bold'
                  }}>
                  {'负责人：'}
                  <Tooltip placement="right" title={row.user_username}>
                    <Avatar style={{marginRight: 8}} src={row.user_avatar}/>
                  </Tooltip>
                </div>
                <h5>说明： {row.description || '无'}</h5>
                <h5>更新时间： {row.updated_at}</h5>
              </div>
            </div>
          },
        },
        actions: {
          render: () => [
            <IconText
              icon={MessageOutlined}
              text="2"
              key="list-vertical-message"
            />,
          ],
        },
      }}
      headerTitle="项目列表"
      request={async (params, sort, filter) => {
        console.log(params, sort, filter);
        const msg = await getProjects({...params});
        return {
          data: msg?.result?.data,
          success: msg?.success,
          total: msg?.result?.total_count
        };
      }}
    />


  </PageContainer>;
};

export default Project;
