import React, {memo, useRef, useState} from 'react'
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormText,
  ProFormTextArea,
  ProTable
} from "@ant-design/pro-components";
import {Button, Form, Popconfirm, Space, Tag, Tooltip} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {useSetState} from "ahooks";
import {deleteAddressId, getAddressS, postAddress, putAddress} from "@/services/admin/address";
import {Access} from "@/components/Boot/Access";
import {deleteEnvironmentId, postEnvironment, putEnvironment} from "@/services/admin/environment";

type operateType = "add" | "see" | "up";
type ModalType = {
  operateType: operateType;
  nowData: API.CurrentAddress | null;
};
const Address: React.FC = () => {
  const [form] = Form.useForm<{ name: string; company: string }>();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [modal, setModal] = useSetState<ModalType>({
    operateType: "add",
    nowData: null
  });
  const actionRef = useRef<ActionType>();

  const columns:ProColumns<API.CurrentAddress>[] = [
    {
      title: 'ID',
      width: '5%',
      dataIndex: 'id',
      hideInForm: true,
      search: false,
    },
    {
      title: '环境',
      width: '8%',
      key: 'env',
      dataIndex: 'env',
      render: env => <Tag>{env}</Tag>,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '地址',
      key: 'gateway',
      search: false,
      tooltip: '地址一般是服务的基础地址，比如https://api.baidu.com, 用例中的地址简写即可',
      dataIndex: 'gateway',
      copyable: true,
      ellipsis: true,
      render: url => <a href={url as string}>{url}</a>,
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
              await deleteAddressId({address_id: record.id});
              actionRef.current?.reload()
            }}
          >
            <Button type="link" danger icon={<DeleteOutlined/>} size={'small'}>
              Delete
            </Button>
          </Popconfirm>
        </Access>,
      ]
    }
  ]
  return <PageContainer>
    <ProTable<API.CurrentAddress>
      actionRef={actionRef}
      rowKey="key"
      search={{
        labelWidth: 'auto',
      }}
      toolBarRender={() => [
        // 新建按钮
        <Button
          type="primary"
          key="primary"
          onClick={() => {
            setModal({
              operateType: 'add',
            })
            handleModalOpen(true);
          }}
        >
          <PlusOutlined/> New
        </Button>,
      ]}
      request={async (params, sort, filter) => {
        console.log(params,sort, filter);
        const msg = await getAddressS({...params});
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
            await postAddress(value);
          }
          if (modal.operateType === "up") {
            // 修改
            await putAddress(value);
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
      <ProFormText width="md" name="id" hidden={true}/>
      <ProFormText width="md" name="env" label={'环境'}/>
      <ProFormText width="md" name="name" label={'昵称'}/>
      <ProFormText width="md" name="gateway" label={'地址'}/>
    </ModalForm>
  </PageContainer>
}

export default memo(Address)
