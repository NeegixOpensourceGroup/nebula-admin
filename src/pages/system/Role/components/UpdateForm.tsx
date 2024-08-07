import services from '@/services/system/role';
import {
  DrawerForm,
  ProCoreActionType,
  ProForm,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import type { TabsProps } from 'antd';
import { Form, message, Tabs } from 'antd';
import { Key, useState } from 'react';
import ApiTable from './ApiTable';
import MenuTree from './MenuTree';
const { updateRole, getRole } = services.RoleController;

const onChange = (key: string) => {
  console.log(key);
};

let pagePermissions: any[] = [];

let apiPermissions: Key[] = [];

interface UpdateFormProps {
  roleId: number | string;
  actionRef?: ProCoreActionType | undefined;
}
const UpdateForm: React.FC<UpdateFormProps> = ({ roleId, actionRef }) => {
  const [form] = Form.useForm<{
    name: string;
    description: string;
    enabled: boolean;
    permission: { checked: Key[]; halfChecked: Key[] };
  }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
  const [tableSelectedKeys, setTableSelectedKeys] = useState<Key[]>([]);
  const onCheck = (checkedKeysValue: Key[], halfCheckedKeys: Key[]) => {
    pagePermissions = [
      ...checkedKeysValue.map((item) => ({ menuId: item, isHalf: false })),
      ...halfCheckedKeys.map((item) => ({ menuId: item, isHalf: true })),
    ];
  };

  const onTableSelected = (selectedKeys: Key[]) => {
    apiPermissions = selectedKeys;
  };

  const roleDetailHanlder = async () => {
    const res = await getRole(roleId);
    if (res.code === 200) {
      form.setFieldsValue({
        name: res.data.name,
        description: res.data.description,
        enabled: res.data.enabled,
      });
      setCheckedKeys(res.data.pagePermissions?.map((item: any) => item.menuId));
      setTableSelectedKeys(res.data.apiPermissions);
    }
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '菜单/按钮权限',
      children: <MenuTree onCheck={onCheck} checkedKeys={checkedKeys} />,
    },
    {
      key: '2',
      label: '接口权限',
      children: (
        <ApiTable
          onTableSelected={onTableSelected}
          tableSelectedKeys={tableSelectedKeys}
        />
      ),
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
      title="编辑角色"
      width={'30%'}
      form={form}
      trigger={<a onClick={roleDetailHanlder}>编辑</a>}
      autoFocusFirstInput
      drawerProps={{
        destroyOnClose: true,
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        const res = await updateRole(roleId, {
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

export default UpdateForm;
