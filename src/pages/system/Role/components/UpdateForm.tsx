import services from '@/services/system/role';
import { EditTwoTone } from '@ant-design/icons';
import {
  DrawerForm,
  ProCoreActionType,
  ProForm,
  // ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import type { TabsProps } from 'antd';
import { Form, message, Tabs } from 'antd';
import { Key, useState } from 'react';
import { useIntl } from 'umi';
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
  const intl = useIntl();
  const [form] = Form.useForm<{
    name: string;
    description: string;
    // enabled: boolean;
    permission: { checked: Key[]; halfChecked: Key[] };
  }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
  const [tableSelectedKeys, setTableSelectedKeys] = useState<Key[]>([]);
  const onCheck = (checkedKeysValue: Key[], halfCheckedKeys: Key[]) => {
    pagePermissions = [
      ...checkedKeysValue.map((item) => ({ pkMenu: item, isHalf: false })),
      ...halfCheckedKeys.map((item) => ({ pkMenu: item, isHalf: true })),
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
        // enabled: res.data.enabled,
      });
      setCheckedKeys(
        res.data.pagePermissions
          ?.filter((item: any) => !item.isHalf)
          .map((item: any) => item.id),
      );
      setTableSelectedKeys(res.data.apiPermissions.map((item: any) => item.id));
      apiPermissions = res.data.apiPermissions.map((item: any) => item.id);
      pagePermissions = res.data.pagePermissions.map((item: any) => ({
        pkMenu: item.id,
        isHalf: item.isHalf,
      }));
    }
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
      children: <MenuTree onCheck={onCheck} checkedKeys={checkedKeys} />,
    },
    {
      key: '2',
      label: (
        <>
          <FormattedMessage id="layout.system.role.api" />{' '}
          <FormattedMessage id="layout.common.access" />
        </>
      ),
      children: (
        <ApiTable
          onTableSelected={onTableSelected}
          tableSelectedKeys={tableSelectedKeys}
        />
      ),
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
    <>
      {contextHolder}
      <DrawerForm<{
        name: string;
        description: string;
        permission: Key[];
      }>
        title={
          <>
            <FormattedMessage id="layout.common.edit" />{' '}
            <FormattedMessage id="layout.system.role.title" />
          </>
        }
        width={'30%'}
        form={form}
        trigger={
          <EditTwoTone
            title={intl.formatMessage({ id: 'layout.common.edit' })}
            onClick={roleDetailHanlder}
          />
        }
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
          {/* <ProFormSwitch
            name="enabled"
            width="md"
            label={intl.formatMessage({ id: 'layout.system.role.enabled' })}
          /> */}
        </ProForm.Group>
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </DrawerForm>
    </>
  );
};

export default UpdateForm;
