import services from '@/services/system/user';
import { PageContainer } from '@ant-design/pro-components';
import {
  Avatar,
  Button,
  Card,
  Flex,
  Form,
  Input,
  message,
  Typography,
  Upload,
} from 'antd'; // 引入Ant Design的Upload组件
import { useState } from 'react';
const { modifyPassword } = services.UserController;
const Profile: React.FC<unknown> = () => {
  const [key, setKey] = useState('base');
  const [isEditing, setIsEditing] = useState(false); // 新增状态变量，用于控制编辑模式
  const [messageApi, contextHolder] = message.useMessage();
  // 假设我们有一些用户信息
  const userInfo = {
    name: '张三',
    email: 'zhangsan@example.com',
    avatar: 'https://via.placeholder.com/150', // 使用占位图作为头像
    department: '技术部',
    position: '软件工程师',
    phone: '13800138000',
    address: '北京市朝阳区某某路某某号',
  };

  const [form] = Form.useForm(); // 新增表单实例

  const renderUserInfo = () => {
    const handleAvatarChange = (info: any) => {
      if (info.file.status === 'done') {
        // 这里可以处理上传成功后的逻辑，比如更新userInfo.avatar
        console.log('Avatar uploaded successfully', info.file.response);
      }
    };

    return (
      <Card>
        <Flex gap={16} align="center" vertical>
          <Card>
            {isEditing ? (
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76" // 这里需要替换为实际的上传接口地址
                onChange={handleAvatarChange}
              >
                {userInfo.avatar ? (
                  <img
                    src={userInfo.avatar}
                    alt="avatar"
                    style={{ width: '100%' }}
                  />
                ) : (
                  <div>
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            ) : (
              <Avatar src={userInfo.avatar} size={128} />
            )}
          </Card>
          {isEditing ? (
            <Form
              form={form} // 绑定表单实例
              name="edit_user_info"
              initialValues={userInfo}
              style={{ width: 300 }}
            >
              <Form.Item
                name="name"
                rules={[{ required: true, message: '请输入姓名!' }]}
              >
                <Input placeholder="姓名" />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[{ required: true, message: '请输入邮箱!' }]}
              >
                <Input placeholder="邮箱" />
              </Form.Item>
              <Form.Item
                name="department"
                rules={[{ required: true, message: '请输入部门!' }]}
              >
                <Input placeholder="部门" />
              </Form.Item>
              <Form.Item
                name="position"
                rules={[{ required: true, message: '请输入职位!' }]}
              >
                <Input placeholder="职位" />
              </Form.Item>
              <Form.Item
                name="phone"
                rules={[{ required: true, message: '请输入电话!' }]}
              >
                <Input placeholder="电话" />
              </Form.Item>
              <Form.Item
                name="address"
                rules={[{ required: true, message: '请输入地址!' }]}
              >
                <Input placeholder="地址" />
              </Form.Item>
            </Form>
          ) : (
            <Card.Meta
              title={userInfo.name}
              description={
                <>
                  <p>邮箱: {userInfo.email}</p>
                  <p>部门: {userInfo.department}</p>
                  <p>职位: {userInfo.position}</p>
                  <p>电话: {userInfo.phone}</p>
                  <p>地址: {userInfo.address}</p>
                </>
              }
              style={{ textAlign: 'center' }} // 添加样式使title居中
            />
          )}
        </Flex>
      </Card>
    );
  };

  const renderPasswordForm = () => {
    return (
      <Card>
        <Typography.Title level={4} style={{ textAlign: 'center' }}>
          重置密码
        </Typography.Title>
        <Flex justify="center" align="center">
          <Form
            form={form} // 绑定表单实例
            name="change_password"
            initialValues={{ remember: true }}
            style={{ width: 300 }}
          >
            <Form.Item
              name="oldPassword"
              rules={[{ required: true, message: '请输入旧密码!' }]}
            >
              <Input.Password placeholder="旧密码" />
            </Form.Item>
            <Form.Item
              name="newPassword"
              rules={[{ required: true, message: '请输入新密码!' }]}
            >
              <Input.Password placeholder="新密码" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={['newPassword']}
              hasFeedback
              rules={[
                { required: true, message: '请确认新密码!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的新密码不一致!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="确认新密码" />
            </Form.Item>
          </Form>
        </Flex>
      </Card>
    );
  };

  const tabListChange = () => {
    switch (key) {
      case 'base':
        return renderUserInfo();
      case 'password':
        return renderPasswordForm();
      default:
        return null;
    }
  };

  const handleReset = () => {
    form.resetFields(); // 重置表单
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Received values of form: ', values);
      // 这里可以添加提交逻辑
      if (key === 'base') {
        // 处理基本信息表单提交逻辑
      } else if (key === 'password') {
        const res = await modifyPassword(values);
        // 处理密码修改表单提交逻辑
        if (res.code === 200) {
          messageApi.success(res.message);
        } else {
          messageApi.error(res.message);
        }
      }
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  return (
    <>
      {contextHolder}
      <PageContainer
        tabList={[
          {
            tab: '基本信息',
            key: 'base',
          },
          {
            tab: '修改密码',
            key: 'password',
          },
        ]}
        tabActiveKey={key}
        onTabChange={(key) => {
          setKey(key);
          form.resetFields(); // 切换tab时重置表单
        }}
        footer={[
          key === 'base' ? (
            <Button key="edit" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? '取消' : '编辑'}
            </Button>
          ) : null,
          isEditing || key !== 'base' ? (
            <Button key="reset" onClick={handleReset}>
              重置
            </Button>
          ) : null, // 添加重置按钮
          isEditing || key !== 'base' ? (
            <Button key="submit" type="primary" onClick={handleSubmit}>
              提交
            </Button>
          ) : null, // 添加提交按钮
        ]}
      >
        {tabListChange()}
      </PageContainer>
    </>
  );
};

export default Profile;
