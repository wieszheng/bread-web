import React, {useState} from "react";
import {
  PageContainer,
} from '@ant-design/pro-components'
import {Button, Form, message, Modal, Space, Input, Card, Tooltip, Table, Row, Col, Flex} from "antd";
import {EditOutlined, PlusOutlined} from '@ant-design/icons';
import {useMount, useSetState} from "ahooks";
import {Access} from "@@/exports";
import {getEnvironments} from "@/services/admin/environment";

type operateType = "add" | "see" | "up";

type ModalType = {
  operateType: operateType;
  nowData: null;
  modalShow: boolean;
  modalLoading: boolean;
};
const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 4},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 19},
  },
};
const Environment: React.FC = () => {
  const [form] = Form.useForm<{ name: string; company: string }>();
  const [loading, setLoading] = useState(false); // 数据是否正在加载中
  const [modal, setModal] = useSetState<ModalType>({
    operateType: "add",
    nowData: null,
    modalShow: false,
    modalLoading: false,
  });
  const [data, setData] = useState<[]>([]); // 当前页面列表数据
  // 分页相关参数
  const [page, setPage] = useSetState({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  });

  const onModalShow = (
    data: any,
    type: operateType
  ): void => {

    setModal({
      modalShow: true,
      nowData: data,
      operateType: type,
    });
    console.log(data, type)
    // 用setTimeout是因为首次让Modal出现时得等它挂载DOM，不然form对象还没来得及挂载到Form上
    setTimeout(() => {
      if (type === "add") {
        // 新增，需重置表单各控件的值
        form.resetFields();
      } else if (data) {
        // 查看或修改，需设置表单各控件的值为当前所选中行的数据
        form.resetFields();
        form.setFieldsValue({
          ...data,
        });
      }
    });
  };
  // 函数 - 查询当前页面所需列表数据
  const onGetData = async (page: {
    pageNum: number;
    pageSize: number;
  }): Promise<void> => {

    const params = {
      current: page.pageNum,
      pageSize: page.pageSize,
    };
    setLoading(true);
    try {
      const res = await getEnvironments({...params});
      if (res && res.code === 200) {
        setData(res.result.data);

      } else {
        message.error(res?.message ?? "数据获取失败");
      }
    } finally {
      setLoading(false);
    }
  }
  // 生命周期 - 组件挂载时触发一次
  useMount(() => {
    onGetData({pageNum: 11, pageSize: 1}).then(r => {console.log(r)});

  });
  // 表格页码改变
  const onTablePageChange = async (pageNum: number, pageSize: number): Promise<void> => {
    await onGetData({pageNum, pageSize});
  };

  const columns: any[] = [
    {
      title: 'ID',
      width: '5%',
      dataIndex: 'id',
      hideInForm: true,
    },
    {
      title: '环境名称',
      width: '8%',
      dataIndex: 'name',
    },
    {
      title: '备注',
      dataIndex: 'remarks',
    },
    {
      title: '创建人',
      dataIndex: 'created_by',
    },
    {
      title: '创建时间',
      sorter: true,
      hideInForm: true,
      dataIndex: 'created_at',
      valueType: 'dateTime',
      width: '15%',
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
      render: (_: null, record: any) => [
        <Access key={'update'} accessible={true}>
          <Tooltip placement="top" title="修改">
            <Button type="link" icon={<EditOutlined/>} size={'small'} onClick={() => {
              onModalShow(record, "up")
            }}>
              Edit
            </Button>
          </Tooltip>
        </Access>,
      ]
    }
  ]


  /** 模态框关闭 **/
  const onClose = () => {
    setModal({
      modalShow: false,
    });
  };
  /** 模态框确定 **/
  const onOk = async (): Promise<void> => {
    if (modal.operateType === "see") {
      onClose();
      return;
    }
    try {
      const values = await form.validateFields();
      console.log(values)
      setModal({
        modalLoading: true,
      });

      setModal({
        modalLoading: false,
        modalShow: false,
      });

    } catch {
      // 未通过校验
    }
  };
  return <PageContainer title={"环境管理"}>
    <Card
      bordered={false}
    >
      <Form
        labelCol={{
          span: 5,
          md: 7
        }}
        form={form}
      >
        <Row
          gutter={[16, 16]}
          wrap
        >
          <Col
            span={24}
            md={12}
            lg={6}
          >
            <Form.Item
              className="m-0"
              name="name"
              label="name"
            >
              <Input placeholder={'请输入name'} />
            </Form.Item>
          </Col>
          <Form.Item>
            <Flex
              gap={12}
              align="center"
              justify="end"
            >
              <Button
              >
                重置
              </Button>
              <Button

                type="primary"
                ghost
                // onClick={search}
              >
                搜索
              </Button>
            </Flex>
          </Form.Item>
        </Row>
      </Form>
    </Card>
    <Card >
      <Space>
        <Button
          type="primary"
          onClick={() => onModalShow(null, "add")}
        >
          添加用户
        </Button>
      </Space>
      <Modal
        title={{add: "新增用户", up: "修改用户", see: "查看信息"}[modal.operateType]}
        open={modal.modalShow}
        onOk={onOk}
        onCancel={onClose}
        confirmLoading={modal.modalLoading}
      >
        <Form
          form={form}
          initialValues={{
            conditions: 1,
          }}
          {...formItemLayout}
        >

          <Form.Item
            label="环境昵称"
            name="name"

            rules={[
              {required: true, whitespace: true, message: "必填"},
              {max: 12, message: "最多输入12位字符"},
            ]}
          >
            <Input
              placeholder="请输入环境昵称"
              disabled={modal.operateType === "see"}
            />
          </Form.Item>
          <Form.Item
            label="备注信息"
            name="remarks"

            rules={[
              {required: true, whitespace: true, message: "必填"},
              {max: 12, message: "最多输入12位字符"},
            ]}
          >
            <Input
              placeholder="请输入备注信息"
              disabled={modal.operateType === "see"}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Table
        columns={columns}
        loading={loading}
        dataSource={data}
        pagination={{
          total: page.total,
          current: page.pageNum,
          pageSize: page.pageSize,
          showQuickJumper: true,
          showTotal: (t) => `共 ${t} 条数据`,
          onChange: onTablePageChange,
        }}
      />
    </Card>
  </PageContainer>
}
export default Environment
