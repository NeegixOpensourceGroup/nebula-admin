import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ProForm,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Avatar, Card, Flex, Upload } from 'antd';
import { useState } from 'react';

interface UserInfoTabProps {
  userInfo: {
    name: string;
    email: string;
    avatar: string;
    department: string;
    position: string;
    phone: string;
    address: string;
  };
  isEditing: boolean;
  form: any;
}

const UserInfoTab: React.FC<UserInfoTabProps> = ({
  userInfo,
  isEditing,
  form,
}) => {
  const [loading, setLoading] = useState(false);
  const handleAvatarChange = (info: any) => {
    if (info.file.status === 'done') {
      // 这里可以处理上传成功后的逻辑，比如更新userInfo.avatar
      setLoading(false);
      console.log('Avatar uploaded successfully', info.file.response);
    }
  };
  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <Card>
      <Flex gap={16} align="center" vertical>
        {!isEditing ? (
          <Avatar size={64} src={userInfo.avatar} />
        ) : (
          <Upload
            name="avatar"
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={false}
            onChange={handleAvatarChange}
            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
          >
            {uploadButton}
          </Upload>
        )}

        <ProForm
          form={form}
          layout="horizontal"
          grid={true}
          submitter={false}
          initialValues={userInfo}
          readonly={!isEditing}
        >
          <ProFormText
            name="department"
            label="部门"
            placeholder="请输入部门"
            colProps={{ span: 12 }}
            width="md"
            readonly={true}
          />
          <ProFormText
            name="position"
            label="职位"
            placeholder="请输入职位"
            colProps={{ span: 12 }}
            width="md"
            readonly={true}
          />
          <ProFormText
            name="name"
            label="姓名"
            placeholder="请输入姓名"
            colProps={{ span: 12 }}
            width="md"
          />
          <ProFormText
            name="email"
            label="邮箱"
            placeholder="请输入邮箱"
            colProps={{ span: 12 }}
            width="md"
          />
          <ProFormText
            name="phone"
            label="电话"
            placeholder="请输入电话"
            colProps={{ span: 12 }}
            width="md"
          />
          <ProFormTextArea
            name="address"
            label="地址"
            placeholder="请输入地址"
            colProps={{ span: 24 }}
          />
        </ProForm>
      </Flex>
    </Card>
  );
};

export default UserInfoTab;
