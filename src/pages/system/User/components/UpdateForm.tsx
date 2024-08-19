import services from '@/services/system/user';
import {
  DrawerForm,
  ProCoreActionType,
  ProForm,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Form, message } from 'antd';
import { Key } from 'react';
import { useIntl } from 'umi';
const { updateUser, queryUserDetail } = services.UserController;

interface UpdateFormProps {
  userId: number | string;
  actionRef?: ProCoreActionType | undefined;
}
const UpdateForm: React.FC<UpdateFormProps> = ({ userId, actionRef }) => {
  const intl = useIntl();
  const [form] = Form.useForm<{
    name: string;
    desc: string;
    email: string;
    phone: string;
    enabled: boolean;
  }>();
  const [messageApi, contextHolder] = message.useMessage();

  const roleDetailHanlder = async () => {
    const res = await queryUserDetail(userId);
    if (res.code === 200) {
      form.setFieldsValue({
        name: res.data.name,
        desc: res.data.desc,
        email: res.data.email,
        phone: res.data.phone,
        enabled: res.data.enabled,
      });
    }
  };

  return (
    <DrawerForm<{
      name: string;
      description: string;
      permission: Key[];
    }>
      title={
        <>
          <FormattedMessage id="layout.common.edit" />{' '}
          <FormattedMessage id="layout.system.user.title" />
        </>
      }
      width={'30%'}
      form={form}
      trigger={
        <a onClick={roleDetailHanlder}>
          <FormattedMessage id="layout.common.edit" />
        </a>
      }
      autoFocusFirstInput
      drawerProps={{
        destroyOnClose: true,
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        const res = await updateUser(userId, {
          ...values,
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
          label={intl.formatMessage({ id: 'layout.system.user.name' })}
        />
        <ProFormText
          rules={[
            {
              required: true,
            },
          ]}
          width="md"
          name="desc"
          label={intl.formatMessage({ id: 'layout.system.user.desc' })}
        />
        <ProFormText
          rules={[
            {
              required: true,
              type: 'email',
            },
          ]}
          width="md"
          name="email"
          label={intl.formatMessage({ id: 'layout.system.user.email' })}
        />
        <ProFormText
          rules={[
            {
              required: true,
            },
          ]}
          width="md"
          name="phone"
          label={intl.formatMessage({ id: 'layout.system.user.phone' })}
        />
        <ProFormSwitch
          rules={[
            {
              required: true,
            },
          ]}
          name="enabled"
          width="md"
          label={intl.formatMessage({ id: 'layout.system.user.enabled' })}
        />
      </ProForm.Group>
    </DrawerForm>
  );
};

export default UpdateForm;
