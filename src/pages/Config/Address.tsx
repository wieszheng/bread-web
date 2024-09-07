import React, {memo, useEffect, useRef, useState} from 'react'
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormText,
  ProTable,
  ProFormSelect
} from "@ant-design/pro-components";
import {Button, Form, message, Popconfirm, Space, Tag, Tooltip} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {useSetState} from "ahooks";
import {deleteAddressId, getAddressS, postAddress, putAddress} from "@/services/admin/address";
import {Access} from "@/components/Boot/Access";
import {getEnvironments} from "@/services/admin/environment";
import {formItemLayout} from "@/constan";


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
  const [data, setData] = useState<API.CurrentEnvironment[]>([]);
  const actionRef = useRef<ActionType>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getEnvironments({current: 1, pageSize: 99});
        setData(response.result.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {

      }
    };
    fetchData();
  }, []);

  const columns: ProColumns<API.CurrentAddress>[] = [
    {
      title: 'ID',
      key: 'id',
      width: '5%',
      dataIndex: 'id',
      hideInForm: true,
      search: false,
    },
    {
      title: '环境',
      width: '8%',
      key: 'env_name',
      dataIndex: 'env_name',
      render: env => <Tag color='volcano'>{env}</Tag>,
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
      width: '12%',
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
            key='delete'
            title='删除'
            description={'您确定要删除此记录吗?'}
            okText={'好的'}
            cancelText={'取消'}
            onConfirm={async () => {
              await deleteAddressId({address_id: record.id});
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
    title: '请求地址管理',
    breadcrumb: {},
  }}>
    <ProTable<API.CurrentAddress>
      headerTitle={'地址列表'}
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
          icon={<PlusOutlined/>}
        >
          添加地址
        </Button>,
      ]}
      request={async (params, sort, filter) => {
        console.log(params, sort, filter);
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
      {...formItemLayout}
      layout={"horizontal"}
      onFinish={async (value) => {
        try {
          console.log(value)
          if (modal.operateType === "add") {
            // 新增
            const res = await postAddress(value);
            if (res?.success) {
              message.success(res?.message);
            }
          }
          if (modal.operateType === "up") {
            // 修改
            const res = await putAddress(value);
            if (res?.success) {
              message.success(res?.message);
            }
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
      <ProFormSelect
        label='环境'
        name='env'
        placeholder='请选择对应环境'
        options={data.map(item => ({
          label: item.name,
          value: item.id
        }))}
        rules={[
          {
            required: true,
            message: '请选择对应环境!',
          },
        ]}
      />
      <ProFormText
        name='name'
        label={'昵称'}
        placeholder='请输入地址名称'
        rules={[
          {
            required: true,
            message: '请输入地址名称!',
          },
        ]}
      />
      <ProFormText
        name='gateway'
        label={'地址'}
        placeholder='请输入服务地址'
        rules={[
          {
            required: true,
            message: '请输入服务地址!',
          },
        ]}
      />
    </ModalForm>
  </PageContainer>
}

export default memo(Address)
