import React from "react";
import {PageContainer, ProCard} from "@ant-design/pro-components";
import useStyles from './style.style';
import {Avatar, Button, Card, Col, Dropdown, Empty, Input, List, message, Progress, Row, Tag, Tooltip} from "antd";
import {EllipsisOutlined, PlusOutlined, QuestionCircleOutlined, SearchOutlined, UserOutlined} from "@ant-design/icons";
import Paragraph from "antd/es/skeleton/Paragraph";
import {ProFormGroup} from "@ant-design/pro-form/lib";
import {ProFormSwitch} from "@ant-design/pro-form";
import {useRequest} from "ahooks";
import {getProjects} from "@/services/admin/project";
import {CheckCard} from "@ant-design/pro-card";
import {history} from '@umijs/max';
import ProList from "@ant-design/pro-list/lib";

const Project: React.FC = () => {
  const {styles} = useStyles();
  // const data = useRequest(
  //   getProjects({current: 1, pageSize: 10}))

  const data = [
    '语雀的天空',
    'Ant Design',
    '蚂蚁金服体验科技',
    'TechUI',
    'TechUI 2.0',
    'Bigfish',
    'Umi',
    'Ant Design Pro',
  ].map((item) => ({
    title: item,
    subTitle: <Tag color="#5BD8A6">语雀专栏</Tag>,
    actions: [<a key="run">邀请</a>, <a key="delete">删除</a>],
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
    content: (
      <div
        style={{
          flex: 1,
        }}
      >
        <div
          style={{
            width: 200,
          }}
        >
          <div>发布中</div>
          <Progress percent={80} />
        </div>
      </div>
    ),
  }));

  return <PageContainer
    header={{
      title: '项目管理',
      breadcrumb: {},
    }}
  >
    <ProCard style={{marginBottom: 12}}>
      <Row gutter={8}>
        <Col span={18}>
          <Button type="primary" onClick={() => setVisible(true)}>
            创建项目
            <Tooltip title="只有超级管理员可以创建项目">
              <QuestionCircleOutlined/>
            </Tooltip>
          </Button>
        </Col>
        <Col span={6}>
          <Input
            className="borderSearch"
            prefix={<SearchOutlined/>}
            // onPressEnter={onSearchProject}
            style={{float: 'right'}}
            placeholder="请输入项目名称"
          />
        </Col>
      </Row>

    </ProCard>
    <ProList<any>
      ghost={true}
      pagination={{
        defaultPageSize: 8,
        showSizeChanger: false,
      }}
      showActions="hover"
      rowSelection={{}}
      grid={{ gutter: 10, column: 4 }}
      onItem={(record: any) => {
        return {
          onMouseEnter: () => {
            console.log(record);
          },
          onClick: () => {
            console.log(record);
          },
        };
      }}
      metas={{
        title: {},
        subTitle: {},
        type: {},
        avatar: {},
        content: {},
        actions: {
          // cardActionProps,
        },
      }}
      headerTitle="卡片列表展示"
      dataSource={data}
    />
    <Row gutter={24}>
      {data.length === 0 ? (
        <Col span={24} style={{textAlign: 'center', marginBottom: 12}}>
          <Card>
            <Empty description="暂无项目, 快点击『创建项目』创建一个吧!" imageStyle={{height: 220}}/>
          </Card>
        </Col>
      ) : (
        data.map((item) => (
          <Col key={item.id} span={6} style={{marginBottom: 24}}>
            <ProCard
              title="带卡片阴影"
              extra={
                <ProFormGroup>
                  <ProFormSwitch
                    name="Enable"
                    noStyle
                    checkedChildren={'启用'}
                    unCheckedChildren={'禁用'}
                  />
                </ProFormGroup>
              }
              hoverable
              bordered
              style={{maxWidth: 500}}
            >
              <Card.Meta
                avatar={<img alt="" className={styles.cardAvatar} src={item.avatar}/>}
                title={<a>{item.title}</a>}
                description={
                  <Paragraph
                    className={styles.item}
                    ellipsis={{
                      rows: 3,
                    }}
                  >
                    {item.description}
                  </Paragraph>
                }
              />
            </ProCard>
            <CheckCard
              avatar={
                <Avatar
                  style={{backgroundColor: '#7265e6', marginTop: 12}}
                  icon={<UserOutlined/>}
                  size="large"
                />
              }
              title="示例一"
              description="选择一个由流程编排提供的典型用户案例，可以从中学习到流程编排很多设计理念。"
              extra={
                <Dropdown
                  placement="topCenter"
                  menu={{
                    onClick: ({domEvent}) => {
                      domEvent.stopPropagation();
                      message.info('menu click');
                    },
                    items: [
                      {
                        label: '菜单',
                        key: '1',
                      },
                      {
                        label: '列表',
                        key: '2',
                      },
                      {
                        label: '表单',
                        key: '3',
                      },
                    ],
                  }}
                >
                  <EllipsisOutlined
                    style={{fontSize: 22, color: 'rgba(0,0,0,0.5)'}}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Dropdown>
              }
              onChange={() => {
                console.log('change')
                history.push(`/project/${item.id}`);
              }}
            />
          </Col>
        ))
      )}
    </Row>


  </PageContainer>;
};

export default Project;
