import services from '@/services/system/role';
import { PlusOutlined } from '@ant-design/icons';
import {
  DrawerForm,
  ProCoreActionType,
  ProForm,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import type { TabsProps } from 'antd';
import { Button, Form, message, Tabs } from 'antd';
import { Key } from 'react';
import { useIntl } from 'umi';
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
  const intl = useIntl();
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
      label: (
        <>
          <FormattedMessage id="layout.system.role.module" />{' '}
          <FormattedMessage id="layout.common.access" />
        </>
      ),
      children: <MenuTree onCheck={onCheck} />,
    },
    {
      key: '2',
      label: (
        <>
          <FormattedMessage id="layout.system.role.api" />{' '}
          <FormattedMessage id="layout.common.access" />
        </>
      ),
      children: <ApiTable onTableSelected={onTableSelected} />,
    },
    {
      key: '3',
      label: (
        <>
          <FormattedMessage id="layout.system.role.data" />{' '}
          <FormattedMessage id="layout.common.access" />
        </>
      ),
      children: 'Content of Tab Pane 3',
    },
    {
      key: '4',
      label: (
        <>
          <FormattedMessage id="layout.system.role.field" />{' '}
          <FormattedMessage id="layout.common.access" />
        </>
      ),
      children: 'Content of Tab Pane 4',
    },
  ];

  return (
    <DrawerForm<{
      name: string;
      description: string;
      permission: Key[];
    }>
      title={
        <>
          <FormattedMessage id="layout.common.add" />{' '}
          <FormattedMessage id="layout.system.role.title" />
        </>
      }
      width={'30%'}
      form={form}
      trigger={
        <Button type="primary">
          <PlusOutlined />
          <FormattedMessage id="layout.common.add" />
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
          label={intl.formatMessage({ id: 'layout.system.role.name' })}
        />
        <ProFormText
          rules={[
            {
              required: true,
            },
          ]}
          width="md"
          name="description"
          label={intl.formatMessage({ id: 'layout.system.role.description' })}
        />
        <ProFormSwitch
          rules={[
            {
              required: true,
            },
          ]}
          name="enabled"
          width="md"
          label={intl.formatMessage({ id: 'layout.system.role.enabled' })}
        />
      </ProForm.Group>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </DrawerForm>
  );
};

export default CreateForm;
