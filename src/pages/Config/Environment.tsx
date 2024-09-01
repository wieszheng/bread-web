import React, {useState} from "react";
import {
  ModalForm,
  ProForm,
  ProCard,
  PageContainer,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components'
import {Button, Form, message, Space} from "antd";
import {PlusOutlined} from '@ant-design/icons';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};
const Environment: React.FC = () => {
  const [modalVisit, setModalVisit] = useState(false);
  const [form] = Form.useForm<{ name: string; company: string }>();

  return <PageContainer title={"环境管理"}>
    <ProCard>
      <Space>
        <Button
          type="primary"
          onClick={() => {
            setModalVisit(true);
          }}
        >
          <PlusOutlined/>
          Modal 展示
        </Button>

      </Space>
      <ModalForm
        title="新建表单"
        open={modalVisit}
        onOpenChange={setModalVisit}
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => console.log('run'),
        }}
        submitTimeout={2000}
        onFinish={async (values) => {
          console.log(values);
          message.success('提交成功');
          return true;
        }}
      >
        <ProForm.Group>
          <ProFormText
            width="md"
            name="name"
            label="签约客户名称"
            tooltip="最长为 24 位"
            placeholder="请输入名称"
          />

          <ProFormText
            width="md"
            name="company"
            label="我方公司名称"
            placeholder="请输入名称"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            width="md"
            name="contract"
            label="合同名称"
            placeholder="请输入名称"
          />
          <ProFormDateRangePicker name="contractTime" label="合同生效时间"/>
        </ProForm.Group>
      </ModalForm>
    </ProCard>
  </PageContainer>
}
export default Environment
