import services from '@/services/log/loginLog';
import dictServices from '@/services/system/dict';
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

const { queryLoginLogList, deleteLoginLog } = services.LoginLogController;
const { queryDictItemByDictCode } = dictServices.DictController;
type LoginLogItem = {
  id: number;
  user: string;
  ip: string;
  loginLocation: string;
  loginTime: string;
};

export default () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedRowsState, setSelectedRows] = useState<any[]>([]);
  const actionRef = useRef<ActionType>();
  const intl = useIntl();

  const columns: ProColumns<LoginLogItem>[] = [
    {
      title: <FormattedMessage id={'layout.log.login.user'} />,
      dataIndex: 'user',
    },
    {
      title: 'IP',
      dataIndex: 'ip',
    },
    {
      title: '平台',
      dataIndex: 'type',
      valueType: 'select',
      request: async () => {
        const res = await queryDictItemByDictCode('PLATFORM_TYPE');
        return res.data.map((item: any) => {
          return {
            value: item.value,
            label: item.name,
          };
        });
      },
    },
    {
      title: '客户端',
      dataIndex: 'client',
    },
    {
      title: '地区',
      dataIndex: 'area',
    },
    {
      title: <FormattedMessage id={'layout.log.login.loginTime'} />,
      dataIndex: 'createTime',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id={'layout.log.login.loginTime'} />,
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
      const res = await deleteLoginLog(
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
        title: <FormattedMessage id={'layout.log.login.title'} />,
      }}
    >
      {contextHolder}
      <ProTable<LoginLogItem>
        columns={columns}
        actionRef={actionRef}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        cardBordered
        request={async (params) => {
          const res = await queryLoginLogList(params);
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
            <FormattedMessage id={'layout.common.batch'} />{' '}
            <FormattedMessage id={'layout.common.delete'} />
          </Button>
        </FooterToolbar>
      )}
    </PageContainer>
  );
};
