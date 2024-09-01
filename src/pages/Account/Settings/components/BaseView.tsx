import {
  ProColumns,
  ProFormInstance,
  ProTable,
} from '@ant-design/pro-components';
import {message, Upload} from 'antd';
import React, {useRef, useState} from 'react';
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import {currentUser as queryCurrentUser, putUserUserInfo,} from '@/services/admin/user';
import {request} from '@umijs/max';
import {useRequest} from 'ahooks';

const BaseView: React.FC = () => {
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const formRef = useRef<ProFormInstance>();
  const [avatar, setAvatar] = useState<string>('');

  const {data: currentUser, loading} = useRequest(async () => {
    const res = await queryCurrentUser();
    if (res) {
      const img = res.result.avatar;
      if (img) {
        setAvatar(img);
      }
      return res.result;
    }
    return {};
  });

  const columns: ProColumns<any>[] = [
    {
      title: '昵称',
      dataIndex: 'nickname',
      valueType: 'text',
      width: 'md',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入您的昵称!',
          },
        ],
      },
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      valueType: 'avatar',
      renderFormItem: () => {
        return (
          <Upload
            name="avatar"
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={false}
            customRequest={async ({file}) => {
              const formData = new FormData();

              formData.append('avatar', file);
              const res = await request('/system/user/avatar', {
                method: 'PUT',
                data: formData,
              });
              setAvatar(res.result.avatar);
              console.log(file);
            }}
          >
            {avatar ? (
              <img src={avatar} alt="avatar" style={{width: '100%'}}/>
            ) : loading ? (
              <LoadingOutlined/>
            ) : (
              <PlusOutlined/>
            )}
          </Upload>
        );
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text',
      width: 'md',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入您的邮箱!',
          },
        ],
      },
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      valueType: 'text',
      width: 'md',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入您的联系电话!',
          },
        ],
      },
    },
  ];

  const handleFinish = async () => {
    const data = formRef.current?.getFieldsValue();
    data.avatar = avatar;
    console.log(currentUser)
    await putUserUserInfo({id: currentUser?.id , ...data});
    message.success('Update successfully!');
  };
  return (
    <ProTable
      type="form"
      formRef={formRef}
      columns={columns}
      onSubmit={handleFinish}
      form={{
        initialValues: {
          ...currentUser,
        },
        layout: 'vertical',
        requiredMark: false,
        submitter: {
          searchConfig: {
            submitText: '更新基本信息',
          },
          render: (_, dom) => dom[1],
        },
      }}
    />
  );
};

export default BaseView;
