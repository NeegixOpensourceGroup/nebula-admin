import services from '@/services/development/api';
import { EyeTwoTone } from '@ant-design/icons';
import { DrawerForm } from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Descriptions } from 'antd';
import { useState } from 'react';
import { useIntl } from 'umi';

const { queryApiById } = services.ApiController;

interface ApiDetail {
  name: string;
  moduleName: string;
  access: string;
}

interface ViewFormProps {
  id: number | string;
}

const ViewForm: React.FC<ViewFormProps> = ({ id }) => {
  const intl = useIntl();
  const [apiDetail, setApiDetail] = useState<ApiDetail | null>(null);

  const roleDetailHanlder = async () => {
    const res = await queryApiById(id);
    if (res.code === 200) {
      setApiDetail({
        name: res.data.name,
        moduleName: res.data.module.name,
        access: res.data.access,
      });
    }
  };

  return (
    <DrawerForm
      title={
        <>
          <FormattedMessage id="layout.common.view" />{' '}
          <FormattedMessage id="layout.development.api.title" />
        </>
      }
      width={'30%'}
      trigger={
        <EyeTwoTone
          title={intl.formatMessage({ id: 'layout.common.view' })}
          onClick={roleDetailHanlder}
        />
      }
      submitter={false}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item
          label={intl.formatMessage({ id: 'layout.development.api.name' })}
        >
          {apiDetail?.name}
        </Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({ id: 'layout.development.api.module' })}
        >
          {apiDetail?.moduleName}
        </Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({ id: 'layout.development.api.access' })}
        >
          {apiDetail?.access}
        </Descriptions.Item>
      </Descriptions>
    </DrawerForm>
  );
};

export default ViewForm;
