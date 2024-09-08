import React, {useRef, useState} from "react";
import {ProColumns, ProFormInstance, ProTable} from "@ant-design/pro-components";
import {useRequest} from "ahooks";
import {currentUser as queryCurrentUser} from "@/services/admin/user";

const EmailConfig: React.FC = () => {
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
      title: '发件人',
      dataIndex: 'sender',
      valueType: 'text',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入发件人邮箱!',
          },
        ],
      },
    },
    {
      title: 'Host',
      dataIndex: 'host',
      valueType: 'text',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入服务器host!',
          },
        ],
      },
    },
    {
      title: '邮箱秘钥',
      dataIndex: 'password',
      valueType: 'password',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入邮箱秘钥!',
          },
        ],
      },
    },
    {
      title: '收件人名称',
      dataIndex: 'to',
      valueType: 'text',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入收件人名称!',
          },
        ],
      },
    },
  ];

  return (
    <ProTable
      type="form"
      formRef={formRef}
      columns={columns}
      // onSubmit={handleFinish}
      form={{
        layout: 'vertical',
        requiredMark: false,
        submitter: {
          searchConfig: {
            submitText: '更新信息',
          },
          render: (_, dom) => dom[1],
        },
      }}
    />
  )

}
export default EmailConfig;
