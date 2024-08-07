import services from '@/services/development/api';
import type { GetProps, TableColumnsType, TableProps } from 'antd';
import { Input, Space, Table } from 'antd';
import { TablePaginationConfig } from 'antd/lib';
import React, { Key, useEffect, useState } from 'react';

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
    title: '接口标识',
    dataIndex: 'name',
  },
  {
    title: '接口描述',
    dataIndex: 'description',
  },
  {
    title: '权限识别杩',
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
      <Search placeholder="接口标识/接口描述/权限识别码" onSearch={onSearch} />
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
