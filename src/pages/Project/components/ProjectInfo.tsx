import React, {useState} from "react";
import {Col, message, Row, Space, Tooltip, Upload} from 'antd';
import {ProForm, ProFormSelect, ProFormSwitch, ProFormText, ProFormTextArea} from '@ant-design/pro-components';
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {putProject, putProjectAvatar} from "@/services/admin/project";

export type FormProps = {
  project?: any;
  users: API.CurrentUser[];
  fetchData?: any;
};
const ProjectInfo: React.FC<FormProps> = ({project, users, fetchData}) => {

  const [avatar, setAvatar] = useState<string>(project.avatar);
  const [loading, setLoading] = useState<boolean>(false);
  const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 18},
  }


  return (
    <Row gutter={8}>
      {/*<Col span={6} />*/}
      <Col span={24} style={{marginTop: 40}}>
        <ProForm
          {...formItemLayout}
          layout={'horizontal'}
          initialValues={project}
          onFinish={async (values) => {
            const res = await putProject({
              ...values,
              id: project.id,
            });
            if (res?.success) {
              message.success(res?.message);
              await fetchData();
            }

          }}
          submitter={{
            render: (props, doms) => {
              return (
                <Row>
                  <Col span={14} offset={10}>
                    <Space>{doms}</Space>
                  </Col>
                </Row>
              );
            },
          }}
        >
          <Row>
            <Col span={4} offset={10} style={{textAlign: 'center'}}>

              <Upload
                name="avatar"
                listType="picture-circle"
                className="avatar-uploader"
                showUploadList={false}
                customRequest={async ({file}) => {
                  setLoading(true);
                  const formData = new FormData();
                  formData.append('avatar', file);
                  const res = await putProjectAvatar(project.id, formData);
                  setAvatar(res.result.avatar);
                  console.log(file);
                  setLoading(false);
                }}
              >
                <Tooltip title="点击可修改头像" placement="rightTop">
                  {avatar ? (
                    <img src={avatar} alt="avatar" style={{width: '100%'}}/>
                  ) : loading ? (
                    <LoadingOutlined/>
                  ) : (
                    <PlusOutlined/>
                  )}
                </Tooltip>
              </Upload>

            </Col>
          </Row>
          <Row style={{marginTop: 20}}>
            <Col span={10} offset={6}>
              <ProFormText
                name='name'
                label='项目名称'
                placeholder='请输入项目名称'
                rules={[{required: true, message: '请输入项目名称'}]}
              />
              <ProFormText
                name='app'
                label='服务名'
                placeholder='请输入项目对应服务名称'
                rules={[{required: true, message: '请输入项目对应服务名称'}]}
              />
              <ProFormSelect
                name='owner'
                label='项目负责人'
                placeholder='选择项目负责人'
                options={users.map(item => ({
                  label: item.username,
                  value: item.id
                }))}
                rules={[
                  {
                    required: true,
                    message: '选择项目负责人!',
                  },
                ]}
              />
              <ProFormTextArea
                name='description'
                label='项目描述'
                placeholder='请输入项目描述'
                rules={[{required: false, message: '请输入项目描述'}]}
              />
              <ProFormText
                name='dingtalk_url'
                label='钉钉通知openapi'
                placeholder='请输入项目对应钉钉群机器人api'
                rules={[{required: false, message: '请输入项目对应钉钉群机器人api'}]}
              />
              <ProFormSwitch
                name='private'
                label='是否私有'
                placeholder='请选择项目是否私有'
                rules={[{required: true, message: '请选择项目是否私有'}]}
              />
            </Col>

          </Row>
        </ProForm>
      </Col>
    </Row>
  )
};
export default ProjectInfo;
