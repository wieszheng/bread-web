import React, {useEffect, useRef, useState} from "react";
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProFormSelect, ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProList
} from "@ant-design/pro-components";
import {Avatar, Button, Dropdown, Form, message, Tag, Tooltip} from "antd";
import {
  EllipsisOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import {deleteProjectId, getProjects, postProject} from "@/services/admin/project";
import {history} from '@umijs/max';
import {formItemLayout, PROJECT_AVATAR_URL, USER_AVATAR_URL} from "@/constan";
import {getUsers} from "@/services/admin/user";


const Project: React.FC = () => {

  const [form] = Form.useForm<{ name: string; company: string }>();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
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
      title={'新增项目'}
      width={550}
      form={form}
      open={createModalOpen}
      onOpenChange={handleModalOpen}
      modalProps={{destroyOnClose: true}}
      {...formItemLayout}
      layout={"horizontal"}
      onFinish={async (value) => {
        try {
          // 新增
          const res = await postProject(value);
          if (res?.success) {
            message.success(res?.message);
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
          label: item.username,
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
      actionRef={actionRef}
      search={{
        labelWidth: 'auto',
        optionRender: () => [

          <Button key="3" type="primary" onClick={() => {
            handleModalOpen(true);
          }}
                  style={{marginRight: 10}}
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
        pageSize: 8,
        size: 'default',
        hideOnSinglePage: true
      }}
      showActions="hover"
      rowKey="name"
      grid={{gutter: 14, column: 4}}
      onItem={(record: any) => {
        return {
          onMouseEnter: () => {
            // console.log(record);
          },
          onClick: () => {
            // console.log(record);
            history.push(`/project/${record.id}`);
          },
        };
      }}
      metas={{
        avatar: {
          dataIndex: 'avatar',
          render: (_, row) => {
            return <Avatar shape={'square'} src={row.avatar || PROJECT_AVATAR_URL}/>
          },
          search: false,
        },
        title: {
          dataIndex: 'name',
          title: '项目名称',
          search: {
            transform: (value) => {
              return {name: value};
            }
          },
          render: (_, row) => {
            return <h3 style={{color: '#000', marginLeft: 8}}>{row.name}</h3>
          },
        },
        subTitle: {
          search: false,
          render: (_, row) => {
            return <Tag color="blue">{row.user_nickname}</Tag>
          },
        },

        content: {
          search: false,
          render: (_, row) => {
            return <div style={{flex: 1,}}>
              <div
                style={{
                  width: 'auto',
                }}
              >
                <div
                  style={{

                    fontWeight: 'bold'
                  }}>
                  {'负责人：'}
                  <Tooltip placement="right" title={row.user_username}>
                    <Avatar style={{marginRight: 8, marginBottom: 6}} src={row.user_avatar || USER_AVATAR_URL}/>
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
                onClick: async (e) => {
                  if (e.key === '1') {
                    message.info('申请权限');
                  } else if (e.key === '2') {
                    const res = await deleteProjectId({project_id: row.id})
                    if (res?.success) {
                      message.success(res?.message);
                    }
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
                style={{fontSize: 25, color: 'rgba(0,0,0,0.5)', marginInlineEnd: 10}}

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
