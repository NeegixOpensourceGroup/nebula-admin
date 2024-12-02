import services from '@/services/system/role';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button, message, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

const { queryRoleList, deleteRole } = services.RoleController;

type GithubIssueItem = {
  url: string;
  id: number;
  number: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  state: string;
  comments: number;
  createTime: string;
  updateTime: string;
  closed_at?: string;
};

export default () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedRowsState, setSelectedRows] = useState<any[]>([]);
  const actionRef = useRef<ActionType>();

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
      title: <FormattedMessage id="layout.system.role.createTime" />,
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          let endDate = value[1] ? new Date(value[1]) : null;
          if (endDate) {
            endDate.setDate(endDate.getDate() + 1); // 增加一天
          }
          const endCreateTime = endDate ? endDate.toISOString() : undefined;
          const startCreateTime = value[0]
            ? new Date(value[0]).toISOString()
            : undefined;
          return {
            startCreateTime,
            endCreateTime,
          };
        },
      },
    },
    {
      title: <FormattedMessage id="layout.common.operate" />,
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <UpdateForm key={'updateForm'} roleId={record.id} actionRef={action} />,
        <a
          href={record.url}
          target="_blank"
          rel="noopener noreferrer"
          key="view"
        >
          <FormattedMessage id="layout.common.view" />
        </a>,
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
          <a>
            <FormattedMessage id="layout.common.delete" />
          </a>
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
          pageSize: 5,
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
