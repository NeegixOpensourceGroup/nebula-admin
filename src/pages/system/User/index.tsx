import services from '@/services/system/user';
import { transformRangeDate } from '@/utils/tools';
import { DeleteTwoTone, SettingTwoTone } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Badge, Button, message, notification, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import { useIntl } from 'umi';
import CreateForm from './components/CreateForm';
import RoleSelectionModal from './components/RoleSelectionModal';
import UpdateForm from './components/UpdateForm';
import ViewForm from './components/ViewForm';

const { queryUserList, deleteUser, bindRole, resetPassword } =
  services.UserController;

type UserItem = {
  url: string;
  id: number;
  number: number;
  title: string;
  state: string;
  comments: number;
  createTime: string;
  updated_at: string;
  closed_at?: string;
  enabled: boolean;
};

export default () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, notificationHolder] = notification.useNotification();

  const [selectedRowsState, setSelectedRows] = useState<UserItem[]>([]);
  const actionRef = useRef<ActionType>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userIds, setUserIds] = useState<number[]>([]);

  const intl = useIntl();
  const showModal = (record?: UserItem) => {
    if (record) {
      setUserIds([record.id]);
    } else {
      setUserIds(selectedRowsState.map((item) => item.id));
    }
    setIsModalOpen(true);
  };

  const handleOk = async (userIds: number[], roleIds: string[]) => {
    const res = await bindRole({ userIds, roleIds });
    if (res.code === 200) {
      messageApi.success('配置成功，即将刷新');
      setIsModalOpen(false);
      actionRef.current?.reload();
      return true;
    } else {
      messageApi.error(res.message);
      return false;
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns: ProColumns<UserItem>[] = [
    {
      title: <FormattedMessage id="layout.system.user.name" />,
      dataIndex: 'name',
    },

    {
      disable: true,
      title: <FormattedMessage id="layout.system.user.desc" />,
      dataIndex: 'description',
    },
    {
      title: <FormattedMessage id="layout.system.user.email" />,
      dataIndex: 'email',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="layout.system.user.phone" />,
      dataIndex: 'mobilePhone',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="layout.system.user.createTime" />,
      dataIndex: 'createTime',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="layout.system.user.createTime" />,
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return transformRangeDate(value);
        },
      },
    },
    {
      title: <FormattedMessage id="layout.common.status" />,
      dataIndex: 'enabled',
      hideInSearch: true,
      render: (_, record) => (
        <>
          {record.enabled ? (
            <Badge
              status="success"
              text={intl.formatMessage({ id: 'layout.common.enabled' })}
            />
          ) : (
            <Badge
              status="error"
              text={intl.formatMessage({ id: 'layout.common.disabled' })}
            />
          )}
        </>
      ),
    },
    {
      title: <FormattedMessage id="layout.common.operate" />,
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <UpdateForm key={'updateForm'} userId={record.id} actionRef={action} />,
        <ViewForm key={'viewForm'} userId={record.id} actionRef={action} />,
        <SettingTwoTone
          key="setting"
          title="角色配置"
          onClick={() => showModal(record)}
        />,
        <Popconfirm
          title={<FormattedMessage id="layout.common.warning" />}
          key="remove"
          description={
            <FormattedMessage id="layout.system.user.message.sure" />
          }
          onConfirm={async () => {
            const res = await deleteUser([record.id]);
            if (res.code === 200) {
              messageApi.success('删除成功，即将刷新');
              action?.reload();
              return true;
            } else {
              messageApi.error(res.message);
              return false;
            }
          }}
        >
          <DeleteTwoTone
            title={intl.formatMessage({ id: 'layout.common.delete' })}
          />
        </Popconfirm>,
      ],
    },
  ];

  /**
   *  删除节点
   * @param selectedRows
   */
  const handleRemove = async (selectedRows: any[]) => {
    const hide = messageApi.loading('正在删除');
    if (!selectedRows) return true;
    try {
      //const res  = await deletePsn(selectedRows.map(item=>item.id).join(","));
      const res = await deleteUser(selectedRows.map((item) => item.id));
      if (res.code === 200) {
        actionRef.current?.reload();
        hide();
        messageApi.success('删除成功，即将刷新');
        return true;
      } else {
        hide();
        messageApi.error(res.message);
        return false;
      }
    } catch (error) {
      hide();
      messageApi.error('删除失败，请重试');
      return false;
    }
  };

  /**
   * 重置密码
   */
  const handleResetPassword = async (selectedRows: any[]) => {
    const hide = messageApi.loading('正在重置');
    if (!selectedRows) return true;
    try {
      const res = await resetPassword(selectedRows.map((item) => item.id));
      if (res.code === 200) {
        actionRef.current?.reload();
        hide();
        notificationApi.success({
          message: res.message,
          description: res.data,
          duration: 0,
        });
      }
    } catch (error) {
      hide();
      messageApi.error('重置失败，请重试');
      return false;
    }
  };

  return (
    <>
      {contextHolder}
      {notificationHolder}
      <PageContainer
        header={{
          title: (
            <>
              <FormattedMessage id={'layout.system.user.title'} />{' '}
              <FormattedMessage id={'layout.common.management'} />
            </>
          ),
        }}
      >
        <ProTable<UserItem>
          columns={columns}
          actionRef={actionRef}
          rowSelection={{
            onChange: (_, selectedRows) => setSelectedRows(selectedRows),
          }}
          cardBordered
          request={async (params) => {
            const res = await queryUserList(params);
            return {
              data: res.data.result,
              total: res.data.total,
              success: true,
            };
          }}
          editable={{
            type: 'multiple',
          }}
          columnsState={{
            persistenceKey: 'pro-table-singe-demos',
            persistenceType: 'localStorage',
            defaultValue: {
              option: { fixed: 'right', disable: true },
            },
          }}
          rowKey="id"
          search={{
            labelWidth: 'auto',
          }}
          options={{
            setting: {
              listsHeight: 400,
            },
          }}
          form={{
            // 由于配置了 transform，提交的参数与定义的不同这里需要转化一下
            syncToUrl: (values, type) => {
              if (type === 'get') {
                return {
                  ...values,
                  createTime: [values.startTime, values.endTime],
                };
              }
              return values;
            },
          }}
          pagination={{
            pageSize: 10,
            onChange: (page) => console.log(page),
          }}
          dateFormatter="string"
          toolBarRender={() => [
            <CreateForm key="createForm" actionRef={actionRef.current} />,
            <Button
              key="role"
              disabled={selectedRowsState?.length === 0}
              onClick={() => showModal()}
            >
              角色配置
            </Button>,
            <Button
              key="resetPassword"
              disabled={selectedRowsState?.length === 0}
              onClick={async () => await handleResetPassword(selectedRowsState)}
            >
              重置密码
            </Button>,
          ]}
        />
        {selectedRowsState?.length > 0 && (
          <FooterToolbar
          // extra={
          //   <div>
          //     已选择{' '}
          //     <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
          //     项&nbsp;&nbsp;
          //   </div>
          // }
          >
            <Button
              onClick={async () => {
                await handleRemove(selectedRowsState);
                setSelectedRows([]);
                actionRef.current?.reloadAndRest?.();
              }}
            >
              <FormattedMessage id={'layout.common.batch'} />{' '}
              <FormattedMessage id={'layout.common.delete'} />
            </Button>
            <Button type="primary">
              <FormattedMessage id={'layout.common.batch'} />{' '}
              <FormattedMessage id={'layout.common.audit'} />
            </Button>
          </FooterToolbar>
        )}
        <RoleSelectionModal
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          userIds={userIds}
        />
      </PageContainer>
    </>
  );
};
