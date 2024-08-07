import services from '@/services/system/role';
import { PlusOutlined } from '@ant-design/icons';
import {
  DrawerForm,
  ProCoreActionType,
  ProForm,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import type { TabsProps } from 'antd';
import { Button, Form, message, Tabs } from 'antd';
import { Key } from 'react';
import ApiTable from './ApiTable';
import MenuTree from './MenuTree';
const { createRole } = services.RoleController;

const onChange = (key: string) => {
  console.log(key);
};

let pagePermissions: any[] = [];

let apiPermissions: Key[] = [];

interface CreateFormProps {
  actionRef: ProCoreActionType | undefined;
}

const CreateForm: React.FC<CreateFormProps> = ({ actionRef }) => {
  const [form] = Form.useForm<{
    name: string;
    description: string;
    enabled: boolean;
    permission: { checked: Key[]; halfChecked: Key[] };
  }>();
  const [messageApi, contextHolder] = message.useMessage();
  const onCheck = (checkedKeysValue: Key[], halfCheckedKeys: Key[]) => {
    pagePermissions = [
      ...checkedKeysValue.map((item) => ({ menuId: item, isHalf: false })),
      ...halfCheckedKeys.map((item) => ({ menuId: item, isHalf: true })),
    ];

    //form.setFieldValue('pagePermissions',checkedKeysValue)
  };
  const onTableSelected = (selectedKeys: Key[]) => {
    apiPermissions = selectedKeys;
  };
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '菜单/按钮权限',
      children: <MenuTree onCheck={onCheck} />,
    },
    {
      key: '2',
      label: '接口权限',
      children: <ApiTable onTableSelected={onTableSelected} />,
    },
    {
      key: '3',
      label: '数据权限',
      children: 'Content of Tab Pane 3',
    },
    {
      key: '4',
      label: '字段权限',
      children: 'Content of Tab Pane 4',
    },
  ];

  return (
    <DrawerForm<{
      name: string;
      description: string;
      permission: Key[];
    }>
      title="新建角色"
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
        const res = await createRole({
          ...values,
          pagePermissions,
          apiPermissions,
        });
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
          label="标识"
          placeholder="请输入标识"
        />
        <ProFormText
          rules={[
            {
              required: true,
            },
          ]}
          width="md"
          name="description"
          label="描述"
          placeholder="请输入描述"
        />
        <ProFormSwitch
          rules={[
            {
              required: true,
            },
          ]}
          name="enabled"
          width="md"
          label="是否启用"
        />
      </ProForm.Group>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </DrawerForm>
  );
};

export default CreateForm;
