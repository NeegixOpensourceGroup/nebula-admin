import services from '@/services/log/optLog';
import dictServices from '@/services/system/dict';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button, message } from 'antd';
import { useRef, useState } from 'react';
const { queryDictItemByDictCode } = dictServices.DictController;
const { queryOptLogList, deleteOptLog } = services.OptLogController;
type OptItem = {
  id: number;
  user: string;
  module: string;
  type: string;
  description: string;
  createTime: string;
};

export default () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedRowsState, setSelectedRows] = useState<any[]>([]);
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<OptItem>[] = [
    {
      title: <FormattedMessage id={'layout.log.operate.user'} />,
      dataIndex: 'user',
    },
    {
      title: <FormattedMessage id={'layout.log.operate.optModule'} />,
      dataIndex: 'module',
    },
    {
      title: <FormattedMessage id={'layout.log.operate.optType'} />,
      dataIndex: 'type',
      valueType: 'select',
      request: async () => {
        const res = await queryDictItemByDictCode('OPERATION_TYPE');
        return res.data.map((item: any) => {
          return {
            value: item.value,
            label: item.name,
          };
        });
      },
    },
    {
      title: <FormattedMessage id={'layout.log.operate.optDesc'} />,
      dataIndex: 'description',
    },
    {
      title: <FormattedMessage id={'layout.log.operate.optTime'} />,
      dataIndex: 'createTime',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id={'layout.log.operate.optTime'} />,
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
      title: <FormattedMessage id={'layout.common.operate'} />,
      valueType: 'option',
      key: 'option',
      render: () => [
        <a target="_blank" rel="noopener noreferrer" key="view">
          <FormattedMessage id={'layout.common.view'} />
        </a>,
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
      const res = await deleteOptLog(
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
        title: <FormattedMessage id={'layout.log.operate.title'} />,
      }}
    >
      {contextHolder}
      <ProTable<OptItem>
        columns={columns}
        actionRef={actionRef}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        cardBordered
        request={async (params) => {
          const res = await queryOptLogList(params);
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
            <FormattedMessage id={'layout.common.batch'} />{' '}
            <FormattedMessage id={'layout.common.delete'} />
          </Button>
        </FooterToolbar>
      )}
    </PageContainer>
  );
};
