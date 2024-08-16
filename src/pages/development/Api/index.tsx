import services from '@/services/development/api';
import menuServices from '@/services/development/menu';
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

const { queryApiList, deleteApi } = services.ApiController;
const { queryMenuList } = menuServices.MenuController;
type ApiItem = {
  id: number;
  name: string;
  description: string;
  module: number;
  created_at: string;
};

export default () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedRowsState, setSelectedRows] = useState<any[]>([]);
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<ApiItem>[] = [
    {
      title: <FormattedMessage id="layout.development.api.name" />,
      dataIndex: 'name',
    },
    {
      title: <FormattedMessage id="layout.development.api.description" />,
      dataIndex: 'description',
    },
    {
      title: <FormattedMessage id="layout.development.api.access" />,
      dataIndex: 'access',
    },
    {
      title: <FormattedMessage id="layout.development.api.module" />,
      dataIndex: 'module',
      valueType: 'select',
      fieldProps: () => {
        return {
          fieldNames: {
            label: 'name',
            value: 'id',
          },
        };
      },
      request: async () => {
        const res = await queryMenuList();
        return res.data;
      },
    },
    {
      title: <FormattedMessage id="layout.development.api.createTime" />,
      dataIndex: 'created_at',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="layout.development.api.createTime" />,
      dataIndex: 'created_at',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
    },
    {
      title: <FormattedMessage id="layout.common.operate" />,
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <UpdateForm key={'updateForm'} id={record.id} actionRef={action} />,
        <a target="_blank" rel="noopener noreferrer" key="view">
          <FormattedMessage id="layout.common.view" />
        </a>,
        <Popconfirm
          title={<FormattedMessage id="layout.common.warning" />}
          key="remove"
          description={
            <FormattedMessage id="layout.development.api.message.sure" />
          }
          onConfirm={async () => {
            const res = await deleteApi(record.id);
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
      const res = await deleteApi(
        selectedRows.map((item) => item.id).join(','),
      );
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

  return (
    <PageContainer
      header={{
        title: (
          <>
            <FormattedMessage id="layout.development.api.title" />{' '}
            <FormattedMessage id="layout.common.management" />
          </>
        ),
      }}
    >
      {contextHolder}
      <ProTable<ApiItem>
        columns={columns}
        actionRef={actionRef}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        cardBordered
        request={async (params) => {
          const res = await queryApiList(params);
          return { data: res.data.list, total: res.data.total, success: true };
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
                created_at: [values.startTime, values.endTime],
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
            <FormattedMessage id="layout.common.batch" />{' '}
            <FormattedMessage id="layout.common.delete" />
          </Button>
          <Button type="primary">
            <FormattedMessage id="layout.common.batch" />{' '}
            <FormattedMessage id="layout.common.audit" />
          </Button>
        </FooterToolbar>
      )}
    </PageContainer>
  );
};
