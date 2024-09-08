import React, {useEffect, useRef, useState} from "react";
import {
  PageContainer,
  type ProColumns,
  ProTable,
  ModalForm,
  ProFormText,
  ProFormSelect, ProFormSwitch, ActionType
} from "@ant-design/pro-components";
import {Space, Tag, Badge, Modal, Button, Form, message, Tooltip, Popconfirm} from "antd";
import {getEnvironments} from "@/services/admin/environment";
import {
  deleteGlobalConfigId,
  getGlobalConfigs,
  postGlobalConfig,
  putGlobalConfig
} from "@/services/admin/global_config";
import {BookTwoTone, DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons"
import {useSetState} from "ahooks";
import CodeEditor from "@/pages/Config/components/CodeEditor";
import {Access} from "@/components/Boot/Access";

const {confirm} = Modal;
const CONFIG_TYPE_TAG: { [key: string]: string } = {
  JSON: 'green',
  Yaml: 'pink',
  String: 'blue',
}
const KEY_TYPE: { [key: number]: string } = {
  0: 'String',
  1: 'JSON',
  2: 'Yaml',
}
type operateType = "add" | "see" | "up";
type ModalType = {
  operateType: operateType;
  nowData: API.CurrentEnvironment | null;
};
const GConfig: React.FC = () => {
  const [envData, setEnvData] = useState<API.CurrentEnvironment[]>([]);
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [modal, setModal] = useSetState<ModalType>({
    operateType: "add",
    nowData: null
  });
  const [type, setType] = useState<number>(0);
  const [, setEditor] = useState<any>(null);
  const formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 19},
  }
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm<any>();
  const fetchData = async () => {
    try {
      const response = await getEnvironments({current: 1, pageSize: 99});
      setEnvData(response.result.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {

    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const columns: ProColumns<any>[] = [
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
      key: 'env_name',
      dataIndex: 'env_name',
      render: env => <Tag color='volcano'>{env}</Tag>,
    },
    {
      title: '类型',
      dataIndex: 'key_type',
      key: 'key_type',
      search: false,
      render: key => <Tag color={CONFIG_TYPE_TAG[KEY_TYPE[key as number]]}>{KEY_TYPE[key as number]}</Tag>,
    },
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      search: false,
      ellipsis: true,
      render: (text, record) => {
        if (record.key_type === 0) {
          return text;
        } else if (record.key_type === 1) {
          return <a onClick={() => {
            confirm({
              title: 'View view',
              icon: <BookTwoTone/>,
              content: <div style={{marginLeft: '-30px', marginTop: '10px'}}><CodeEditor value={record.value}
                                                                                         editable={false}
                                                                                         type={1}/></div>,
              footer: (_, {CancelBtn}) => (
                <>
                  <CancelBtn/>
                </>
              ),
            });
          }}>查看</a>;
        } else if (record.key_type === 2) {
          return <a onClick={() => {
            confirm({
              title: 'View view',
              icon: <BookTwoTone/>,
              content: <div style={{marginLeft: '-30px', marginTop: '10px'}}><CodeEditor value={record.value}
                                                                                         editable={false}
                                                                                         type={2}/></div>,
              footer: (_, {CancelBtn}) => (
                <>
                  <CancelBtn/>
                </>
              ),
            });
          }}>查看</a>;
        }

      }
    },
    {
      title: '是否可用',
      dataIndex: 'enable',
      key: 'enable',
      search: false,
      render: text => <Badge status={text ? 'success' : 'error'} text={text ? '使用中' : '已禁止'}/>,
    },
    {
      title: '创建人',
      dataIndex: 'user_avatar',
      key: 'avatar',
      valueType: 'avatar',
      search: false,
      width: '10%',
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
      width: '12%',
      search: false,
    },
    {
      title: '更新时间',
      search: false,
      sorter: true,
      hideInForm: true,
      dataIndex: 'updated_at',
      valueType: 'dateTime',
      width: '12%',
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
              await deleteGlobalConfigId({global_id: record.id});
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
      title: '全局变量',
      breadcrumb: {},
    }}>
    <ModalForm
      title={{add: "添加变量", up: "修改变量", see: "查看信息"}[modal.operateType]}
      width="500px"
      form={form}
      open={createModalOpen}
      onOpenChange={handleModalOpen}
      {...formItemLayout}
      layout={"horizontal"}
      onFinish={async (value) => {
        try {
          console.log(value)
          if (modal.operateType === "add") {
            // 新增
            const res = await postGlobalConfig(value);
            if (res?.success) {
              message.success(res?.message);
            }
          }
          if (modal.operateType === "up") {
            // 修改
            const res = await putGlobalConfig(value);
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
        options={envData.map(item => ({
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
      <ProFormSelect
        label='类型'
        name='key_type'
        placeholder='请选择对应数据类型'
        initialValue={{
          value: type,
          label: KEY_TYPE[type],
        }}
        options={Object.entries(KEY_TYPE).map(([key, value]) => ({
          value: key,
          label: value,
        }))}
        onChange={(type) => {
          setType(type as number)
        }}
        rules={[
          {
            required: true,
            message: '请选择对应数据类型!',
          },
        ]}
      />
      <ProFormText
        name='key'
        label='Key'
        placeholder='请输入key'
        rules={[
          {
            required: true,
            message: '请输入key!',
          },
        ]}
      />

      <Form.Item
        name='value'
        label='Value'
        rules={[
          {
            required: true,
            message: '请输入value!',
          },
        ]}
      >
        <CodeEditor type={type} editable={true} onChange={(value: any) => {
          console.log(value)
          setEditor(value);
        }}></CodeEditor>
      </Form.Item>
      <ProFormSwitch
        name='enable'
        label='是否可用'
        rules={[
          {
            required: true,
            message: '请选择是否可用!',
          },
        ]}
      />
    </ModalForm>
    <ProTable
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
          添加变量
        </Button>,
      ]}
      headerTitle={'全局变量'}
      actionRef={actionRef}
      rowKey="key"
      search={{
        labelWidth: 'auto',
      }}
      columns={columns}
      pagination={{
        pageSize: 10,
        size: 'default',
        hideOnSinglePage: true
      }}
      request={async (params, sort, filter) => {
        console.log(params, sort, filter);
        const msg = await getGlobalConfigs({...params});
        return {
          data: msg?.result?.data,
          success: msg?.success,
          total: msg?.result?.total_count
        };
      }}
    >

    </ProTable>
  </PageContainer>
}
export default GConfig;
