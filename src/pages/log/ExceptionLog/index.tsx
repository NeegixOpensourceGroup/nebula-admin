import services from '@/services/log/exceptionLog';
import { transformRangeDate } from '@/utils/tools';
import { EyeTwoTone } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button, message } from 'antd';
import { useRef, useState } from 'react';
import { useIntl } from 'umi';

const { queryExceptionLogList, deleteExceptionLog } =
  services.ExceptionLogController;
type ExceptionLogItem = {
  id: number;
  ip: string;
  area: string;
  type: number;
  client: string;
  isSuccess: boolean;
  description: string;
  createTime: string;
};

export default () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedRowsState, setSelectedRows] = useState<any[]>([]);
  const actionRef = useRef<ActionType>();
  const intl = useIntl();

  const columns: ProColumns<ExceptionLogItem>[] = [
    {
      title: <FormattedMessage id="layout.log.exception.user" />,
      dataIndex: 'user',
    },
    {
      title: <FormattedMessage id="layout.log.exception.module" />,
      dataIndex: 'module',
    },
    {
      title: <FormattedMessage id="layout.log.exception.type" />,
      dataIndex: 'type',
    },
    {
      title: <FormattedMessage id="layout.log.exception.description" />,
      dataIndex: 'description',
    },
    {
      title: <FormattedMessage id="layout.log.exception.uri" />,
      dataIndex: 'uri',
    },
    {
      title: <FormattedMessage id="layout.log.exception.fullName" />,
      dataIndex: 'fullName',
    },
    {
      title: <FormattedMessage id="layout.log.exception.exception" />,
      dataIndex: 'exception',
    },
    {
      title: <FormattedMessage id="layout.log.exception.exceptionTime" />,
      dataIndex: 'createTime',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="layout.log.exception.exceptionTime" />,
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
      render: () => [
        <EyeTwoTone
          key="view"
          title={intl.formatMessage({ id: 'layout.common.view' })}
        />,
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
      const res = await deleteExceptionLog(
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
        title: <FormattedMessage id="layout.log.exception.title" />,
      }}
    >
      {contextHolder}
      <ProTable<ExceptionLogItem>
        columns={columns}
        actionRef={actionRef}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        cardBordered
        request={async (params) => {
          const res = await queryExceptionLogList(params);
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
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: 10,
          onChange: (page) => console.log(page),
          showSizeChanger: false,
        }}
        dateFormatter="string"
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
            type="primary"
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage id="layout.common.batch" />{' '}
            <FormattedMessage id="layout.common.delete" />
          </Button>
        </FooterToolbar>
      )}
    </PageContainer>
  );
};
