import React, {useRef, useState} from 'react';
import {
  PageContainer,
  ProTable
} from "@ant-design/pro-components";
import {useParams} from '@umijs/max';
import {indexTitle} from "@/util/indexTitle";
import {deleteUsersId, getUsers, putUserRole, putUserState} from "@/services/admin/user";
import {Button, Tag, Modal, Form, Popconfirm, Switch, Input, Card, Select, message, Space} from 'antd';
import {
  EditOutlined, DeleteOutlined, UserOutlined,
  CheckOutlined, CloseOutlined
} from '@ant-design/icons';
import {Access} from '@/components/Boot/Access';
import type {ActionType, ProColumns} from '@ant-design/pro-components';

const USER_ROLE_TAG: { [key: number]: string } = {
  0: 'default',
  1: 'blue',
  2: 'red',
}

const USER_ROLE: { [key: number]: string } = {
  0: '普通用户',
  1: '组长',
  2: '超级管理员',
}
const UserList: React.FC = () => {

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<any>();
  const {id} = useParams();

  const [form] = Form.useForm();


  const columns: ProColumns<API.CurrentUser>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
      key: 'id',
    },
    {
      title: <span><UserOutlined/> 账号</span>,
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '昵称',
      dataIndex: 'avatar',
      key: 'avatar',
      valueType: 'avatar',
      search: false,
      width: 150,
      render: (dom, record) => (
        <Space>
          <span>{dom}</span>
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            {record?.nickname}
          </a>

        </Space>
      ),
    },
    {
      title: '✉ 邮箱',
      dataIndex: 'email',
      key: 'email',
      search: false,
    },
    {
      title: '🎨 角色',
      dataIndex: 'role',
      key: 'role',
      search: false,
      render: role => <Tag color={USER_ROLE_TAG[role as number]}>{USER_ROLE[role as number]}</Tag>
    },
    {
      title: '上次登录',
      dataIndex: 'last_login_at',
      key: 'last_login_at',
      search: false,
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'created_at',
      search: false,
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      title: '🚫 是否启用',
      dataIndex: 'is_valid',
      key: 'is_valid',
      search: false,
      render: (is_valid, record) => <Switch
        checkedChildren={<CheckOutlined/>}
        unCheckedChildren={<CloseOutlined/>}
        defaultChecked={!is_valid}
        onChange={async (checked: boolean) => {
          await putUserState({id: record.id || '', is_valid: !checked})
          message
            .success('Delete successfully!'
            )
            .then(() => actionRef.current?.reload());
        }}/>
    },
    {
      title: '🧷 操作',
      dataIndex: 'option',
      valueType: 'option',
      hideInDescriptions: true,
      hideInForm: true,
      render: (_, record) => [
        <Access key={'update'} accessible={true}>
          <Button type="link" icon={<EditOutlined/>} size={'small'} onClick={() => {
            setCurrentRow(record);
            form.setFieldsValue(record)
            setIsModalOpen(true);
          }}>
            Edit
          </Button>
        </Access>,
        <Access key={'delete'}>
          <Popconfirm
            key="delete"
            title={'删除'}
            description={'您确定要删除此记录吗?'}
            okText={'好的'}
            cancelText={'取消'}
            onConfirm={async () => {
              await deleteUsersId({id: record.id!});
              message
                .success('Delete successfully!'
                )
                .then(() => actionRef.current?.reload());
            }}
          >
            <Button type="link" danger icon={<DeleteOutlined/>} size={'small'}>
              Delete
            </Button>
          </Popconfirm>
        </Access>
      ]
    }
  ];


  return (
    <PageContainer title={indexTitle(id)}>
      <Card>
        <Modal
          title="编辑用户"
          width={500}
          open={isModalOpen}
          onOk={async () => {
            const values = await form.getFieldsValue();
            console.log('form', values)
            await putUserRole({
              ...values,
              id: currentRow?.id || '',
            })
            setCurrentRow(undefined);
            setIsModalOpen(false);
            message
              .success('Delete successfully!'
              )
              .then(() => actionRef.current?.reload());
          }}
          onCancel={() => setIsModalOpen(false)}
        >
          <Form
            initialValues={currentRow}
            form={form}
          >
            <Form.Item label="账号" name="username">
              <Input placeholder="输入用户账号"/>
            </Form.Item>
            <Form.Item label="邮箱" name="email">
              <Input placeholder="输入用户邮箱"/>
            </Form.Item>
            <Form.Item label="角色" name="role">
              <Select>
                <Select.Option key={0} value={0}>普通成员</Select.Option>
                <Select.Option key={1} value={1}>组长</Select.Option>
                <Select.Option key={2} value={2}>超级管理员</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
        <ProTable<API.CurrentUser>
          headerTitle={'用户列表'}
          actionRef={actionRef}
          rowKey="id"
          search={{
            labelWidth: 120,
          }}
          request={async (params, sort, filter) => {
            console.log(sort, filter);
            const msg = await getUsers({...params});
            return {
              data: msg?.result?.data,
              params,
            };
          }}
          columns={columns}
        ></ProTable>
      </Card>


    </PageContainer>
  );
};

export default UserList;
