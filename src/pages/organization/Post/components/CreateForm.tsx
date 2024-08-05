import services from '@/services/organization/post';
import { PlusOutlined } from '@ant-design/icons';
import {
  DrawerForm,
  ProCoreActionType,
  ProForm,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
const { addPost } = services.PostController;

interface CreateFormProps {
  actionRef: ProCoreActionType | undefined;
}

const CreateForm: React.FC<CreateFormProps> = ({ actionRef }) => {
  const [form] = Form.useForm<{
    code: string;
    name: string;
    enabled: boolean;
  }>();
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <DrawerForm<{
      code: string;
      name: string;
      enabled: boolean;
    }>
      title="新建岗位"
      width={'30%'}
      form={form}
      trigger={
        <Button type="primary">
          <PlusOutlined />
          新建
        </Button>
      }
      autoFocusFirstInput
      drawerProps={{
        destroyOnClose: true,
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        const res = await addPost(values);
        if (res.code === 200) {
          messageApi.success(res.message);
          actionRef?.reload();
        } else {
          messageApi.error(res.message);
        }

        // 不返回不会关闭弹框
        return true;
      }}
    >
      {contextHolder}
      <ProForm.Group>
        <ProFormText
          rules={[
            {
              required: true,
            },
          ]}
          name="code"
          width="md"
          label="岗位编码"
          placeholder="请输入岗位编码"
        />
        <ProFormText
          rules={[
            {
              required: true,
            },
          ]}
          width="md"
          name="name"
          label="岗位名称"
          placeholder="请输入岗位名称"
        />
        <ProFormSwitch width="md" name="enabled" label="是否启用" />
      </ProForm.Group>
    </DrawerForm>
  );
};

export default CreateForm;
