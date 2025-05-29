import { Card, Flex, Form, Input, Typography } from 'antd';

interface PasswordTabProps {
  form: any;
}

const PasswordTab: React.FC<PasswordTabProps> = ({ form }) => {
  return (
    <Card>
      <Typography.Title level={4} style={{ textAlign: 'center' }}>
        重置密码
      </Typography.Title>
      <Flex justify="center" align="center">
        <Form
          form={form}
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

export default PasswordTab;
