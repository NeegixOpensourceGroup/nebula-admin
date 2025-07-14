import services from '@/services/system/user';
import { EyeTwoTone } from '@ant-design/icons';
import { DrawerForm, ProCoreActionType } from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Badge, Descriptions } from 'antd';
import { useState } from 'react';
import { useIntl } from 'umi';
const { queryUserDetail } = services.UserController;

interface ViewFormProps {
  userId: number | string;
  actionRef?: ProCoreActionType | undefined;
}

interface UserDetail {
  name: string;
  description: string;
  email: string;
  mobilePhone: string;
  enabled: boolean;
  userType: {
    id: number;
    name: string;
    value: string;
  };
}

const ViewForm: React.FC<ViewFormProps> = ({ userId }) => {
  const intl = useIntl();
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);

  const userDetailHandler = async () => {
    const res = await queryUserDetail(userId);
    if (res.code === 200) {
      setUserDetail({
        name: res.data.name,
        description: res.data.description,
        email: res.data.email,
        mobilePhone: res.data.mobilePhone,
        enabled: res.data.enabled,
        userType: res.data.userType,
      });
    }
  };

  return (
    <DrawerForm
      title={
        <>
          <FormattedMessage id="layout.common.view" />{' '}
          <FormattedMessage id="layout.system.user.title" />
        </>
      }
      width={'40%'}
      trigger={
        <EyeTwoTone
          title={intl.formatMessage({ id: 'layout.common.view' })}
          onClick={userDetailHandler}
        />
      }
      submitter={false}
      drawerProps={{
        destroyOnClose: true,
      }}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item
          label={intl.formatMessage({ id: 'layout.system.user.name' })}
        >
          {userDetail?.name}
        </Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({ id: 'layout.system.user.desc' })}
        >
          {userDetail?.description}
        </Descriptions.Item>
        <Descriptions.Item label="用户类型">
          {userDetail?.userType?.name}
        </Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({ id: 'layout.system.user.email' })}
        >
          {userDetail?.email}
        </Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({ id: 'layout.system.user.phone' })}
        >
          {userDetail?.mobilePhone}
        </Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({ id: 'layout.system.user.enabled' })}
        >
          <Badge
            status={userDetail?.enabled ? 'success' : 'error'}
            text={intl.formatMessage({
              id: userDetail?.enabled
                ? 'layout.common.enabled'
                : 'layout.common.disabled',
            })}
          />
        </Descriptions.Item>
      </Descriptions>
    </DrawerForm>
  );
};

export default ViewForm;
