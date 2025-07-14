import dictServices from '@/services/system/dict';
import services from '@/services/system/user';
import { EditTwoTone } from '@ant-design/icons';
import {
  DrawerForm,
  ProCoreActionType,
  ProForm,
  ProFormSelect,
  // ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Form, message } from 'antd';
import { Key } from 'react';
import { useIntl } from 'umi';
const { queryDictItemByDictCode } = dictServices.DictController;
const { updateUser, queryUserDetail } = services.UserController;

interface UpdateFormProps {
  userId: number | string;
  actionRef?: ProCoreActionType | undefined;
}
const UpdateForm: React.FC<UpdateFormProps> = ({ userId, actionRef }) => {
  const intl = useIntl();
  const [form] = Form.useForm<{
    name: string;
    description: string;
    email: string;
    mobilePhone: string;
    enabled: boolean;
    userType: number;
  }>();
  const [messageApi, contextHolder] = message.useMessage();

  const roleDetailHanlder = async () => {
    const res = await queryUserDetail(userId);
    if (res.code === 200) {
      form.setFieldsValue({
        name: res.data.name,
        description: res.data.description,
        email: res.data.email,
        mobilePhone: res.data.mobilePhone,
        // enabled: res.data.enabled,
        userType: res.data.userType?.id,
      });
    }
  };

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
            <FormattedMessage id="layout.system.user.title" />
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
            name="description"
            label={intl.formatMessage({ id: 'layout.system.user.desc' })}
          />
          <ProFormSelect
            width="md"
            name="userType"
            label="账号类型"
            request={async () => {
              const res = await queryDictItemByDictCode('ACCOUNT_TYPE');
              return res.data.map((item: any) => {
                return {
                  value: item.id,
                  label: item.name,
                };
              });
            }}
          />
          <ProFormText
            width="md"
            name="email"
            label={intl.formatMessage({ id: 'layout.system.user.email' })}
          />
          <ProFormText
            width="md"
            name="mobilePhone"
            label={intl.formatMessage({ id: 'layout.system.user.phone' })}
          />
          {/* <ProFormSwitch
            name="enabled"
            width="md"
            label={intl.formatMessage({ id: 'layout.system.user.enabled' })}
          /> */}
        </ProForm.Group>
      </DrawerForm>
    </>
  );
};

export default UpdateForm;
