import services from '@/services/development/api';
import menuServices from '@/services/development/menu';
import { buildTreeData } from '@/utils/tools';
import { PlusOutlined } from '@ant-design/icons';
import {
  DrawerForm,
  ProCoreActionType,
  ProForm,
  ProFormText,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
const { createApi } = services.ApiController;
const { queryMenuList } = menuServices.MenuController;

interface CreateFormProps {
  actionRef: ProCoreActionType | undefined;
}

const CreateForm: React.FC<CreateFormProps> = ({ actionRef }) => {
  const [form] = Form.useForm<{
    name: string;
    description: string;
    module: string | number;
    access: string;
  }>();
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <DrawerForm<{
      name: string;
      description: string;
      module: string | number;
      access: string;
      created_at: string;
    }>
      title="新建接口"
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
        const res = await createApi(values);
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
          name="name"
          width="md"
          label="接口标识"
          placeholder="请输入接口标识"
        />
        <ProFormText
          rules={[
            {
              required: true,
            },
          ]}
          width="md"
          name="description"
          label="接口描述"
          placeholder="请输入接口描述"
        />
        <ProFormText
          rules={[
            {
              required: true,
            },
          ]}
          width="md"
          name="access"
          label="权限识别码"
          placeholder="请输入权限识别码"
        />
        <ProFormTreeSelect
          width="md"
          name="module"
          label="所属模块"
          placeholder="请选择权限识别码"
          allowClear
          fieldProps={{
            showSearch: true,
            treeNodeFilterProp: 'title',
            // multiple: true,
            treeDefaultExpandAll: true,
          }}
          request={async () => {
            const res = await queryMenuList();
            const treeData = buildTreeData(res.data, {
              idKey: 'id',
              nameKey: 'name',
              pidKey: 'pid',
            });
            return treeData;
          }}
        />
      </ProForm.Group>
    </DrawerForm>
  );
};

export default CreateForm;
