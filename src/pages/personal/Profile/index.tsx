import services from '@/services/system/user';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
import { useState } from 'react';
import PasswordTab from './components/PasswordTab';
import UserInfoTab from './components/UserInfoTab';
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

  const tabListChange = () => {
    switch (key) {
      case 'base':
        return (
          <UserInfoTab userInfo={userInfo} isEditing={isEditing} form={form} />
        );
      case 'password':
        return <PasswordTab form={form} />;
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
