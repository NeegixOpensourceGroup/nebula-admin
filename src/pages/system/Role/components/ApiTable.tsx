import services from '@/services/development/api';
import { FormattedMessage } from '@umijs/max';
import type { GetProps, TableColumnsType, TableProps } from 'antd';
import { Input, Space, Table } from 'antd';
import { TablePaginationConfig } from 'antd/lib';
import React, { Key, useEffect, useState } from 'react';
import { useIntl } from 'umi';

const { queryApiList } = services.ApiController;
type TableRowSelection<T> = TableProps<T>['rowSelection'];

interface DataType {
  id: React.Key;
  name: string;
  description: string;
  access: string;
  module: number;
}
type SearchProps = GetProps<typeof Input.Search>;
const onSearch: SearchProps['onSearch'] = (value, _e, info) =>
  console.log(info?.source, value);
const { Search } = Input;

const columns: TableColumnsType<DataType> = [
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
];
interface ApiTableProps {
  onTableSelected: (selectedRowKeys: React.Key[]) => void;
  tableSelectedKeys?: Key[];
}
const ApiTable: React.FC<ApiTableProps> = ({
  onTableSelected,
  tableSelectedKeys,
}) => {
  const intl = useIntl();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [apiData, setApiData] = useState<DataType[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    onTableSelected(newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    preserveSelectedRowKeys: true,
    selectedRowKeys,
    onChange: onSelectChange,
  };

  useEffect(() => {
    queryApiList({ ...pagination }).then((res) => {
      setApiData(res.data.list);
      setPagination({
        total: res.data.total,
        current: res.data.current,
        pageSize: res.data.pageSize,
      });
      if (tableSelectedKeys) {
        setSelectedRowKeys(tableSelectedKeys);
      }
    });
  }, []);

  return (
    <Space
      direction="vertical"
      size="large"
      style={{ width: '100%', display: 'flex' }}
    >
      <Search
        placeholder={`${intl.formatMessage({
          id: 'layout.development.api.name',
        })}/${intl.formatMessage({
          id: 'layout.development.api.description',
        })}/${intl.formatMessage({ id: 'layout.development.api.access' })}`}
        onSearch={onSearch}
      />
      <Table
        rowKey={(record) => record.id}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => {
            queryApiList({ current: page, pageSize }).then((res) => {
              setApiData(res.data.list);
              setPagination({
                total: res.data.total,
                current: res.data.current,
                pageSize: res.data.pageSize,
              });
            });
          },
        }}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={apiData}
      />
    </Space>
  );
};

export default ApiTable;
