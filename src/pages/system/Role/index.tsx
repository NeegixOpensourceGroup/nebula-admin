import services from '@/services/system/role';
import { transformRangeDate } from '@/utils/tools';
import { DeleteTwoTone } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button, message, Popconfirm, Switch } from 'antd';
import { useRef, useState } from 'react';
import { useIntl } from 'umi';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

const { queryRoleList, deleteRole, disableRole, enabledRole } =
  services.RoleController;

type GithubIssueItem = {
  url: string;
  id: number;
  number: number;
  name: string;
  labels: {
    name: string;
    color: string;
  }[];
  state: string;
  comments: number;
  createTime: string;
  updateTime: string;
  enabled: boolean;
  closed_at?: string;
};

export default () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedRowsState, setSelectedRows] = useState<any[]>([]);
  const actionRef = useRef<ActionType>();
  const intl = useIntl();
  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: <FormattedMessage id="layout.system.role.name" />,
      dataIndex: 'name',
    },

    {
      disable: true,
      title: <FormattedMessage id="layout.system.role.description" />,
      dataIndex: 'description',
    },
    {
      title: <FormattedMessage id="layout.system.role.createTime" />,
      dataIndex: 'createTime',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="layout.common.status" />,
      dataIndex: 'enabled',
      hideInSearch: true,
      render: (_, record, index, action) => (
        <Switch
          checked={record.enabled}
          onChange={async (checked) => {
            if (checked) {
              const { code, message } = await enabledRole(record.id);
              if (code === 200) {
                messageApi.success('启用成功，即将刷新');
                action?.reload();
                return true;
              } else {
                messageApi.error(message);
                return false;
              }
            } else {
              const { code, message } = await disableRole(record.id);
              if (code === 200) {
                messageApi.success('禁用成功，即将刷新');
                action?.reload();
                return true;
              } else {
                messageApi.error(message);
                return false;
              }
            }
          }}
        />
      ),
      // render: (_, record) => (
      //   <>
      //     {record.enabled ? (
      //       <Badge
      //         status="success"
      //         text={intl.formatMessage({ id: 'layout.common.enabled' })}
      //       />
      //     ) : (
      //       <Badge
      //         status="error"
      //         text={intl.formatMessage({ id: 'layout.common.disabled' })}
      //       />
      //     )}
      //   </>
      // ),
    },
    {
      title: <FormattedMessage id="layout.system.role.createTime" />,
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
      title: <FormattedMessage id="layout.common.operate" />,
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <UpdateForm key={'updateForm'} roleId={record.id} actionRef={action} />,
        <Popconfirm
          title={<FormattedMessage id="layout.common.warning" />}
          key="remove"
          description={
            <FormattedMessage id="layout.system.role.message.sure" />
          }
          onConfirm={async () => {
            const res = await deleteRole([record.id]);
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
      const res = await deleteRole(selectedRows.map((item) => item.id));
      if (res.code === 200) {
        actionRef.current?.reload();
        hide();
        messageApi.success('删除成功!');
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

  return (
    <PageContainer
      header={{
        title: (
          <>
            <FormattedMessage id={'layout.system.role.title'} />{' '}
            <FormattedMessage id={'layout.common.management'} />
          </>
        ),
      }}
    >
      {contextHolder}
      <ProTable<GithubIssueItem>
        columns={columns}
        actionRef={actionRef}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        cardBordered
        request={async (params) => {
          const res = await queryRoleList(params);
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
          onChange(value) {
            console.log('value: ', value);
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
    </PageContainer>
  );
};
