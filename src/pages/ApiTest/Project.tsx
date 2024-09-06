import React, {useEffect, useRef, useState} from "react";
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProFormSelect, ProFormSwitch,
  ProFormText,
  ProFormTextArea
} from "@ant-design/pro-components";
import {Avatar, Button, Dropdown, Form, message, Tag, Tooltip} from "antd";
import {
  EllipsisOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import {deleteProject, getProjects, postProject} from "@/services/admin/project";
import {history} from '@umijs/max';
import ProList from "@ant-design/pro-list/lib";
import {formItemLayout} from "@/constan";
import {useSetState} from "ahooks";
import {getUsers} from "@/services/admin/user";


type operateType = "add" | "see" | "up";
type ModalType = {
  operateType: operateType;
  nowData: API.CurrentAddress | null;
};

const Project: React.FC = () => {
  const [activeKey, setActiveKey] = useState<React.Key | undefined>('tab1');
  const [form] = Form.useForm<{ name: string; company: string }>();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [modal, setModal] = useSetState<ModalType>({
    operateType: "add",
    nowData: null
  });
  const actionRef = useRef<ActionType>();
  const [data, setData] = useState<API.CurrentUser[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {result} = await getUsers({current: 1, pageSize: 99});
        setData(result.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {

      }
    };
    fetchData();
  }, []);

  return <PageContainer
    header={{
      title: '项目管理',
      breadcrumb: {},
    }}
  >
    <ModalForm
      title={{add: "新增项目", up: "修改项目", see: "查看信息"}[modal.operateType]}
      width={550}
      form={form}
      open={createModalOpen}
      onOpenChange={handleModalOpen}
      modalProps={{destroyOnClose: true}}
      {...formItemLayout}
      layout={"horizontal"}
      onFinish={async (value) => {
        try {
          console.log(value)
          if (modal.operateType === "add") {
            // 新增
            const res = await postProject(value);
            if (res?.success) {
              message.success(res?.message);
            }
          }
          if (modal.operateType === "up") {
            // 修改

          }


        } catch {
          // 未通过校验
        }
        handleModalOpen(false);
        if (actionRef.current) {
          actionRef?.current?.reload();
        }
      }}
    >
      <ProFormText name="id" hidden={true}/>
      <ProFormText
        name='name'
        label='昵称'
        placeholder='请输入项目名称'
        rules={[
          {
            required: true,
            message: '请输入项目名称!',
          },
        ]}
      />
      <ProFormText
        name='app'
        label='服务名'
        placeholder='请输入项目对应服务名称'
        rules={[
          {
            required: true,
            message: '请输入项目对应服务名称!',
          },
        ]}
      />
      <ProFormSelect
        label='负责人'
        name='owner'
        placeholder='请选择负责人'
        options={data.map(item => ({
          label: item.nickname,
          value: item.id
        }))}
        rules={[
          {
            required: true,
            message: '请选择负责人!',
          },
        ]}
      />
      <ProFormTextArea
        name='description'
        label='项目描述'
        placeholder='请输入项目描述'
        rules={[
          {
            required: true,
            message: '请输入项目描述!',
          },
        ]}
      />
      <ProFormSwitch
        name='private'
        label='是否私有'
        rules={[
          {
            required: true,
            message: '请选择项目是否私有!',
          },
        ]}
      />
    </ModalForm>
    <ProList<any>
      size={'large'}
      actionRef={actionRef}
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
            handleModalOpen(true);
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
        pageSize: 12,
        size: 'default',
        hideOnSinglePage: true
      }}
      showActions="hover"
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
          render: (_, row) => {
            return <Dropdown
              menu={{
                onClick:async (e) => {
                  if (e.key === '1'){
                    message.info('申请权限');
                    await deleteProject(row.id)
                  }else if (e.key === '2'){
                    await deleteProject(row.id)
                    message.info('删除项目');
                  }
                  actionRef?.current?.reload();

                },
                items: [
                  {
                    label: '申请权限',
                    key: '1',
                  },
                  {
                    label: '删除项目',
                    key: '2',
                  },
                ],
              }}
            >
              <EllipsisOutlined
                style={{fontSize: 25, color: 'rgba(0,0,0,0.5)',marginInlineEnd: 10}}

              />
            </Dropdown>
          }
        },
      }}
      headerTitle="项目列表"
      request={async (params, sort, filter) => {
        console.log(params, sort, filter);
        const {result, success} = await getProjects({...params});
        if (success) {
          return {
            data: result?.data,
            success: success,
            total: result?.total_count
          };
        } else {
          return {
            data: [],
            success: false,
            total: 0,
          };
        }

      }}
    />


  </PageContainer>;
};

export default Project;
