import services from '@/services/organization/post';
import {
  DrawerForm,
  ProCoreActionType,
  ProForm,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, message } from 'antd';
const { updatePost, queryPostDetail } = services.PostController;

interface UpdateFormProps {
  id: number | string;
  actionRef?: ProCoreActionType | undefined;
}
const UpdateForm: React.FC<UpdateFormProps> = ({ id, actionRef }) => {
  const [form] = Form.useForm<{
    code: string;
    name: string;
    enabled: boolean;
  }>();
  const [messageApi, contextHolder] = message.useMessage();

  const roleDetailHanlder = async () => {
    const res = await queryPostDetail(id);
    if (res.code === 200) {
      form.setFieldsValue({
        name: res.data.name,
        code: res.data.code,
        enabled: res.data.enabled,
      });
    }
  };

  return (
    <DrawerForm<{
      code: string;
      name: string;
      enabled: boolean;
    }>
      title="编辑接口"
      width={'30%'}
      form={form}
      trigger={<a onClick={roleDetailHanlder}>编辑</a>}
      autoFocusFirstInput
      drawerProps={{
        destroyOnClose: true,
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        const res = await updatePost(id, values);
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

export default UpdateForm;
