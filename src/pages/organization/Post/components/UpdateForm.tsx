import services from '@/services/organization/post';
import {
  DrawerForm,
  ProCoreActionType,
  ProForm,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Form, message } from 'antd';
import { useIntl } from 'umi';
const { updatePost, queryPostDetail } = services.PostController;

interface UpdateFormProps {
  id?: string | number;
  pkBizUnit: string | number;
  pkDept?: string | number;
  actionRef?: ProCoreActionType | undefined;
}
const UpdateForm: React.FC<UpdateFormProps> = ({
  id,
  pkBizUnit,
  pkDept,
  actionRef,
}) => {
  const [form] = Form.useForm<{
    code: string;
    name: string;
    enabled: boolean;
  }>();
  const [messageApi, contextHolder] = message.useMessage();
  const intl = useIntl();
  const roleDetailHanlder = async () => {
    if (!id) {
      return;
    }
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
    <>
      {contextHolder}
      <DrawerForm<{
        code: string;
        name: string;
        enabled: boolean;
      }>
        title={
          <>
            <FormattedMessage id="layout.common.edit" />{' '}
            <FormattedMessage id="layout.organization.position.title" />
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
          if (!id) {
            return;
          }
          const res = await updatePost(id, { ...values, pkBizUnit, pkDept });
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
            name="code"
            width="md"
            label={intl.formatMessage({
              id: 'layout.organization.position.code',
            })}
          />
          <ProFormText
            rules={[
              {
                required: true,
              },
            ]}
            width="md"
            name="name"
            label={intl.formatMessage({
              id: 'layout.organization.position.name',
            })}
          />
          <ProFormSwitch
            width="md"
            name="enabled"
            label={intl.formatMessage({
              id: 'layout.organization.position.enabled',
            })}
          />
        </ProForm.Group>
      </DrawerForm>
    </>
  );
};

export default UpdateForm;
