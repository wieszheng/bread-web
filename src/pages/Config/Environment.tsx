import React, {useRef, useState} from "react";
import {
  ActionType, ModalForm,
  PageContainer, ProTable, ProFormText, ProFormTextArea, type ProColumns
} from '@ant-design/pro-components'
import {Button, Form, Popconfirm, Space, Tooltip,} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import {useSetState} from "ahooks";
import {deleteEnvironmentId, getEnvironments, postEnvironment, putEnvironment} from "@/services/admin/environment";
import {Access} from '@/components/Boot/Access';


type operateType = "add" | "see" | "up";
type ModalType = {
  operateType: operateType;
  nowData: API.CurrentEnvironment | null;
};
const Environment: React.FC = () => {
  const [form] = Form.useForm<{ name: string; company: string }>();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [modal, setModal] = useSetState<ModalType>({
    operateType: "add",
    nowData: null
  });
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<API.CurrentEnvironment>[] = [
    {
      title: 'ID',
      width: '5%',
      dataIndex: 'id',
      hideInForm: true,
      search: false,
    },
    {
      title: '环境名称',
      width: '8%',
      dataIndex: 'name',
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      search: false,
    },
    {
      title: '创建人',
      dataIndex: 'user_avatar',
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
            {record?.user_nickname}
          </a>

        </Space>
      ),
    },
    {
      title: '创建时间',
      sorter: true,
      hideInForm: true,
      dataIndex: 'created_at',
      valueType: 'dateTime',
      width: '15%',
      search: false,
    },
    {
      title: '更新时间',
      search: false,
      sorter: true,
      hideInForm: true,
      dataIndex: 'updated_at',
      valueType: 'dateTime',
      width: '15%',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      hideInDescriptions: true,
      hideInForm: true,
      width: '10%',
      render: (_, record) => [
        <Access key={'update'} accessible={true}>
          <Tooltip placement="top" title="修改">
            <Button type="link" icon={<EditOutlined/>} size={'small'} onClick={() => {
              setModal({
                operateType: 'up',
                nowData: record
              })
              handleModalOpen(true);
              form.setFieldsValue(record)
            }}>
              Edit
            </Button>
          </Tooltip>
        </Access>,
        <Access key={'delete'}>
          <Popconfirm
            key="delete"
            title={'删除'}
            description={'您确定要删除此记录吗?'}
            okText={'好的'}
            cancelText={'取消'}
            onConfirm={async () => {
              await deleteEnvironmentId({env_id: record.id});
              actionRef.current?.reload()
            }}
          >
            <Tooltip placement="top" title="删除">
              <Button type="link" danger icon={<DeleteOutlined/>} size={'small'}>
                Delete
              </Button>
            </Tooltip>

          </Popconfirm>
        </Access>,
      ]
    }
  ]


  return <PageContainer
    header={{
      title: '环境配置',
      breadcrumb: {},
    }}>
    <ProTable<API.CurrentEnvironment>
      headerTitle={'环境列表'}
      actionRef={actionRef}
      rowKey="key"
      search={{
        labelWidth: 'auto',
      }}
      toolBarRender={() => [
        // 新建按钮
        <Button
          type="primary"
          key="id"
          onClick={() => {
            setModal({
              operateType: 'add',
            })
            handleModalOpen(true);
          }}
          icon={<PlusOutlined/>}
        >
          新增环境
        </Button>,
      ]}
      request={async (params, sort, filter) => {
        console.log(params, sort, filter);
        const msg = await getEnvironments({...params});
        return {
          data: msg?.result?.data,
          success: msg?.success,
          total: msg?.result?.total_count
        };
      }}
      columns={columns}
      pagination={{
        pageSize: 10,
        size: 'default',
        hideOnSinglePage: true
      }}
    >

    </ProTable>
    <ModalForm
      title={{add: "新增", up: "修改", see: "查看信息"}[modal.operateType]}
      width="450px"
      form={form}
      open={createModalOpen}
      onOpenChange={handleModalOpen}
      modalProps={{destroyOnClose: true}}
      onFinish={async (value) => {
        try {
          console.log(value)
          if (modal.operateType === "add") {
            // 新增
            await postEnvironment(value);
          }
          if (modal.operateType === "up") {
            // 修改
            await putEnvironment(value);
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
        name="name"
        label='环境昵称'
        placeholder='请输入环境名'
        rules={[
          {
            required: true,
            message: '请输入环境名',
          },
        ]}
      />
      <ProFormTextArea
        name="remarks"
        label='环境描述'
        placeholder='请输入描述信息'
        rules={[
          {
            required: true,
            message: '请输入描述信息',
          },
        ]}
      />
    </ModalForm>
  </PageContainer>
}
export default Environment
