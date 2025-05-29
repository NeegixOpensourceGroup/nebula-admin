import services from '@/services/development/api';
import menuServices from '@/services/development/menu';
import { buildTreeData } from '@/utils/tools';
import { CopyTwoTone } from '@ant-design/icons';
import {
  DrawerForm,
  ProCoreActionType,
  ProForm,
  ProFormText,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Form, message } from 'antd';
import { useIntl } from 'umi';
const { createApi, queryApiById } = services.ApiController;
const { queryMenuList } = menuServices.MenuController;

interface CopyFormProps {
  id: number | string;
  actionRef?: ProCoreActionType | undefined;
}
const CopyForm: React.FC<CopyFormProps> = ({ id, actionRef }) => {
  const intl = useIntl();
  const [form] = Form.useForm<{
    name: string;
    description: string;
    module: string | number;
    access: string;
  }>();
  const [messageApi, contextHolder] = message.useMessage();

  const roleDetailHanlder = async () => {
    const res = await queryApiById(id);
    if (res.code === 200) {
      form.setFieldsValue({
        name: res.data.name,
        description: res.data.description,
        module: res.data.module.id,
        access: res.data.access,
      });
    }
  };

  return (
    <DrawerForm<{
      name: string;
      description: string;
      module: number;
      access: string;
    }>
      title={
        <>
          <FormattedMessage id="layout.common.copy" />{' '}
          <FormattedMessage id="layout.development.api.title" />
        </>
      }
      width={'30%'}
      form={form}
      trigger={
        <CopyTwoTone
          title={intl.formatMessage({ id: 'layout.common.copy' })}
          onClick={roleDetailHanlder}
        />
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
          label={intl.formatMessage({ id: 'layout.development.api.name' })}
        />
        <ProFormText
          rules={[
            {
              required: true,
            },
          ]}
          width="md"
          name="access"
          label={intl.formatMessage({ id: 'layout.development.api.access' })}
        />
        <ProFormTreeSelect
          width="md"
          name="module"
          label={intl.formatMessage({ id: 'layout.development.api.module' })}
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

export default CopyForm;
