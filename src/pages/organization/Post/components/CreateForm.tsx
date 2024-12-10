import services from '@/services/organization/post';
import { PlusOutlined } from '@ant-design/icons';
import {
  DrawerForm,
  ProCoreActionType,
  ProForm,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button, Form, message } from 'antd';
import { useIntl } from 'umi';
const { addPost } = services.PostController;

interface CreateFormProps {
  pkBizUnit: string | number;
  pkDept?: string | number;
  actionRef: ProCoreActionType | undefined;
}

const CreateForm: React.FC<CreateFormProps> = ({
  actionRef,
  pkBizUnit,
  pkDept,
}) => {
  const [form] = Form.useForm<{
    code: string;
    name: string;
    enabled: boolean;
  }>();
  const [messageApi, contextHolder] = message.useMessage();
  const intl = useIntl();

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
            <FormattedMessage id="layout.common.add" />{' '}
            <FormattedMessage id="layout.organization.position.title" />
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
          const res = await addPost({ ...values, pkBizUnit, pkDept });
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

export default CreateForm;
