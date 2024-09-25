import React, {useEffect, useState} from "react";
import {ProList, ModalForm, ProFormSelect} from '@ant-design/pro-components';
import {Tag, Button, Popconfirm, Tooltip, message, Select} from 'antd';
import {DeleteTwoTone,} from '@ant-design/icons';
import {deleteProjectRoleId, postProjectRole, putProjectRole} from "@/services/admin/project";
import {formItemLayout, PROJECT_ROLE_MAP} from "@/constan";
import {useParams} from "@umijs/max";

export type FormProps = {
  project?: any;
  roles?: any;
  users: API.CurrentUser[];
  fetchData?: any;
};


const ProjectRole: React.FC<FormProps> = ({users, project, roles, fetchData}) => {
  const params: any = useParams();
  const [dataSource, setDataSource] = useState(roles);
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);

  useEffect(() => {

    setDataSource([
      {
        user_id: project.owner,
        user_username: project.user_username,
        user_nickname: project.user_nickname,
        user_avatar: project.user_avatar,
        project_role: 'OWNER',
      },
      ...roles,
    ])
  }, [roles]);

  return <div>
    <ModalForm
      title={'分配角色'}
      width={450}
      open={createModalOpen}
      onOpenChange={handleModalOpen}
      {...formItemLayout}
      layout={"horizontal"}
      onFinish={async (value) => {
        const res = await postProjectRole({...value, project_id: params.id})
        if (res?.success) {
          message.success(res?.message);
          handleModalOpen(false);
          await fetchData();
        }
      }}
    >
      <ProFormSelect
        label='用户'
        name='user_id'
        placeholder='请选择人员'
        options={users.map(item => ({
          label: item.username,
          value: item.id
        }))}
        rules={[
          {
            required: true,
            message: '请选择人员!',
          },
        ]}
      />
      <ProFormSelect
        label='角色'
        name='project_role'
        placeholder='请选择角色'
        options={Object.entries(PROJECT_ROLE_MAP).map(([key, value]) => ({
          value: key,
          label: value,
        }))}
        rules={[
          {
            required: true,
            message: '请选择角色!',
          },
        ]}
      />
    </ModalForm>
    <ProList<any>
      toolbar={{
        search: {
          onSearch: (value: string) => {
            if (value === '') {
              setDataSource([
                {
                  user_id: project.owner,
                  user_username: project.user_username,
                  user_nickname: project.user_nickname,
                  user_avatar: project.user_avatar,
                  project_role: 'OWNER',
                },
                ...roles,
              ])
              return
            }
            const now = roles.filter((item: {
              user_username: string;
            }) => item.user_username.toLowerCase().indexOf(value.toLowerCase()) > -1)

            setDataSource([
              {
                user_id: project.owner,
                user_username: project.user_username,
                user_nickname: project.user_nickname,
                user_avatar: project.user_avatar,
                project_role: 'OWNER',
              },
              ...now,
            ])
          },
          placeholder: "请输入项目名称",
        },
        actions: [
          <Button key="1" type="primary" onClick={() => {
            handleModalOpen(true);
          }}
          >
            添加成员
          </Button>,
        ],
      }}
      rowKey="id"
      dataSource={dataSource}
      showActions="hover"
      pagination={{
        pageSize: 5,
      }}

      metas={{
        title: {
          dataIndex: 'user_username',
          title: '用户',
        },
        avatar: {
          dataIndex: 'user_avatar',
          search: false,
        },
        description: {
          dataIndex: 'user_nickname',
          search: false,
        },
        subTitle: {
          dataIndex: 'project_role',
          render: (_, row) => {
            if (row.project_role === 'OWNER') {
              return (
                <Tag color="blue" key={row.name}>
                  负责人
                </Tag>
              );
            } else if (row.project_role === 1) {
              return (
                <Tag color="orange" key={row.name}>
                  组长
                </Tag>
              );
            }
            return [
              <Tag color="green" key={row.name}>
                成员
              </Tag>
            ]
          },
          search: false,
        },
        actions: {
          render: (_, row) => {
            if (row.project_role === 'OWNER') {
              return [];
            }
            return [
              <Select key={row.id}
                      style={{width: 80, marginRight: 16}}
                      defaultValue={{
                        value: row.project_role,
                        label: PROJECT_ROLE_MAP[row.project_role]
                      }}
                      onChange={async (value) => {
                        const res = await putProjectRole({...row, project_role: value});
                        if (res?.success) {
                          message.success(res?.message);
                          await fetchData();
                        }
                      }}
                      options={Object.entries(PROJECT_ROLE_MAP).map(([key, value]) => ({
                        value: key,
                        label: value,
                      }))}
              />,
              <Popconfirm
                title="确定要删除该角色吗？"
                onConfirm={async () => {
                  const res = await deleteProjectRoleId({
                    role_id: row.id,
                  })
                  if (res?.success) {
                    message.success(res?.message);
                    await fetchData();
                  }
                }}
                okText="确定"
                cancelText="取消"
                key="delete"
              >
                <Tooltip placement="left" title={'删除该角色'}>
                  <DeleteTwoTone twoToneColor="red" style={{cursor: 'pointer'}}/>
                </Tooltip>

              </Popconfirm>,
            ]
          },
          search: false,
        },
      }}
    />
  </div>;

}
export default ProjectRole;
