import services from '@/services/system/dict';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProCard,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components/es';
import { FormattedMessage } from '@umijs/max';
import type { PopconfirmProps, TableProps } from 'antd';
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
} from 'antd';
import type { SearchProps } from 'antd/es/input/Search';
import { FormProps } from 'antd/lib';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'umi';

const {
  queryDictList,
  updateDict,
  addDict,
  removeDict,
  queryDictItemList,
  updateDictItem,
  addDictItem,
  removeDictItem,
} = services.DictController;

const { Search } = Input;

const cancel: PopconfirmProps['onCancel'] = (e) => {
  if (e && typeof e.stopPropagation === 'function') {
    e.stopPropagation();
  }
  message.open({
    type: 'error',
    content: '删除取消',
    duration: 2,
  });
};

const DictList: React.FC = () => {
  const intl = useIntl();
  const [groupForm] = Form.useForm();
  const [itemForm] = Form.useForm();
  const [openGroup, setOpenGroup] = useState(false);
  const [openItem, setOpenItem] = useState(false);
  const [groupData, setGroupData] = useState<DictGroupDataType>();
  const [itemData, setItemData] = useState<DictItemDataType>();
  const [groupPagination, setGroupPagination] = useState<
    Pagination<DictGroupDataType>
  >({
    current: 1,
    pageSize: 10,
    total: 0,
    data: [],
  });
  const [itemPagination, setItemPagination] = useState<
    Pagination<DictItemDataType>
  >({
    current: 1,
    pageSize: 10,
    total: 0,
    data: [],
  });
  const actionRef = useRef<ActionType | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]); // 新增状态变量，用于存储选中的行的key

  useEffect(() => {
    const queryDictGroupFun = async () => {
      const res = await queryDictList({ ...groupPagination });
      setGroupPagination({
        current: res.data?.currentPage,
        pageSize: res.data?.pageSize,
        total: res.data?.total,
        data: res.data?.result,
      });
      // 设置默认选中第一行
      if (res.data?.result && res.data?.result.length > 0) {
        setGroupData(res.data?.result[0]);
        setSelectedRowKeys([res.data?.result[0].id]); // 设置默认选中的行的key
      }
    };

    queryDictGroupFun();
  }, []);

  const onSearch: SearchProps['onSearch'] = async (value) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: _, ...rest } = groupPagination;
    if (value) {
      const res = await queryDictList({ ...rest, name: value });
      setGroupPagination({
        current: res.data?.currentPage,
        pageSize: res.data?.pageSize,
        total: res.data?.total,
        data: res.data?.result,
      });
    } else {
      const res = await queryDictList({ ...rest });
      setGroupPagination({
        current: res.data?.currentPage,
        pageSize: res.data?.pageSize,
        total: res.data?.total,
        data: res.data?.result,
      });
    }
  };

  const showDictGroupModal = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    values?: DictGroupDataType,
  ) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    setGroupData(values);
    setOpenGroup(!openGroup);
  };

  const showDictItemModal = (
    e: React.MouseEvent<HTMLAnchorElement>,
    values?: DictItemDataType,
  ) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    setItemData(values);
    setOpenItem(!openItem);
  };

  const onGroupFinish: FormProps<DictGroupDataType>['onFinish'] = async (
    values,
  ) => {
    if (groupData?.id) {
      const res = await updateDict({ ...groupData, ...values });
      if (res.code === 200) {
        message.open({
          type: 'success',
          content: res.message,
          duration: 2,
        });
        setOpenGroup(false);
      }
    } else {
      const res = await addDict(values);
      if (res.code === 200) {
        message.open({
          type: 'success',
          content: res.message,
          duration: 2,
        });
        setOpenGroup(false);
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: _, ...rest } = groupPagination;
    const resList = await queryDictList({ ...rest });
    setGroupPagination({
      current: resList.data?.currentPage,
      pageSize: resList.data?.pageSize,
      total: resList.data?.total,
      data: resList.data?.result,
    });
  };

  // 删除字典分类
  const confirmGroup: PopconfirmProps['onConfirm'] = async (e) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }

    const res = await removeDict([groupData?.id || 1]);
    if (res.code === 200) {
      setGroupData(undefined);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data: _, ...rest } = groupPagination;
      const resList = await queryDictList({ ...rest });
      setGroupPagination({
        current: resList.data?.currentPage,
        pageSize: resList.data?.pageSize,
        total: resList.data?.total,
        data: resList.data?.result,
      });
      message.open({
        type: 'success',
        content: res.message,
        duration: 2,
      });
    }
  };

  // TODO 删除字典项
  const confirmItem: PopconfirmProps['onConfirm'] = async (e) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    const res = await removeDictItem(groupData?.id || 1, [itemData?.id || 1]);
    if (res.code === 200) {
      actionRef.current?.reload();
      message.open({
        type: 'success',
        content: res.message,
        duration: 2,
      });
    }
  };

  const onItemFinish: FormProps<DictItemDataType>['onFinish'] = async (
    values,
  ) => {
    if (itemData?.id && groupData?.id) {
      itemData.pkDictGroup = groupData?.id;
      const res = await updateDictItem({ ...itemData, ...values });
      if (res.code === 200) {
        message.open({
          type: 'success',
          content: res.message,
          duration: 2,
        });
        setOpenItem(false);
      }
    } else {
      const res = await addDictItem({ ...values, dictId: groupData?.id });
      if (res.code === 200) {
        message.open({
          type: 'success',
          content: res.message,
          duration: 2,
        });
        setOpenItem(false);
      }
    }
    actionRef.current?.reload();
  };

  const dictGroups: TableProps<DictGroupDataType>['columns'] = [
    {
      title: intl.formatMessage({ id: 'layout.common.sn' }),
      width: 40,
      render: (text, record, index) => (index + 1).toString(),
    },
    {
      title: intl.formatMessage({ id: 'layout.system.dictionary.groupCode' }),
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: intl.formatMessage({ id: 'layout.system.dictionary.groupName' }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: intl.formatMessage({ id: 'layout.common.operate' }),
      key: 'action',
      width: 80,
      render: (_e, record) => (
        <Space size="middle">
          <EditTwoTone
            title={intl.formatMessage({ id: 'layout.common.edit' })}
            onClick={(e) =>
              showDictGroupModal(
                e as React.MouseEvent<HTMLAnchorElement>,
                record,
              )
            }
          />
          <Popconfirm
            title={
              <FormattedMessage id="layout.system.dictionary.message.group.sure" />
            }
            onConfirm={confirmGroup}
            onCancel={cancel}
          >
            <DeleteTwoTone
              title={intl.formatMessage({ id: 'layout.common.delete' })}
              onClick={(e) => {
                e.stopPropagation();
                setGroupData(record);
              }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const dictItems: ProColumns<DictItemDataType, 'text'>[] = [
    {
      title: intl.formatMessage({ id: 'layout.common.sn' }),
      width: 40,
      hideInSearch: true,
      render: (text, record, index) => (index + 1).toString(),
    },
    {
      title: <FormattedMessage id="layout.system.dictionary.name" />,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: <FormattedMessage id="layout.system.dictionary.value" />,
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: <FormattedMessage id="layout.common.operate" />,
      key: 'action',
      width: 80,
      hideInSearch: true,
      render: (_e, record) => (
        <Space size="middle">
          <EditTwoTone
            title={intl.formatMessage({ id: 'layout.common.edit' })}
            onClick={(e) =>
              showDictItemModal(
                e as React.MouseEvent<HTMLAnchorElement>,
                record,
              )
            }
          />
          <Popconfirm
            title={
              <FormattedMessage id="layout.system.dictionary.message.sure" />
            }
            onConfirm={confirmItem}
            onCancel={cancel}
          >
            <DeleteTwoTone
              title={intl.formatMessage({ id: 'layout.common.delete' })}
              onClick={(e) => {
                e.stopPropagation();
                setItemData(record);
              }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <PageContainer
      header={{
        title: (
          <>
            <FormattedMessage id="layout.system.dictionary.title" />{' '}
            <FormattedMessage id="layout.common.management" />
          </>
        ),
      }}
    >
      <ProCard split="vertical">
        <ProCard
          title={<FormattedMessage id="layout.system.dictionary.title" />}
          colSpan="35%"
        >
          <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Space size="middle">
              <Button
                type="primary"
                shape="circle"
                icon={<PlusOutlined />}
                onClick={(e) =>
                  showDictGroupModal(e as React.MouseEvent<HTMLAnchorElement>)
                }
              />
              <Search
                placeholder={intl.formatMessage({ id: 'layout.common.search' })}
                onSearch={onSearch}
                enterButton
                style={{ margin: 8 }}
              />
            </Space>
            <Table
              rowSelection={{
                type: 'radio',
                selectedRowKeys: selectedRowKeys, // 使用selectedRowKeys来设置默认选中的行
                onChange: (selectedRowKeys, selectedRows) => {
                  setGroupData(selectedRows[0]);
                  setSelectedRowKeys(selectedRowKeys); // 更新选中的行的key
                },
              }}
              columns={dictGroups}
              dataSource={groupPagination.data}
              rowKey="id"
              pagination={{
                ...groupPagination,
                onChange: async (current, pageSize) => {
                  const res = await queryDictList({
                    current: current,
                    pageSize: pageSize,
                  });
                  if (res.code === 200) {
                    setGroupPagination({
                      current: res.data?.currentPage,
                      pageSize: res.data?.pageSize,
                      total: res.data?.total,
                      data: res.data?.result,
                    });
                  }
                },
              }}
              onRow={(record) => {
                return {
                  onClick: () => {
                    // 重置到默认值，包括表单
                    if (actionRef.current && actionRef.current.reset) {
                      actionRef.current.reset();
                    }
                    setGroupData(record);
                    setSelectedRowKeys([record.id]); // 设置选中的行的key
                  }, // 点击行
                };
              }}
            />
          </Space>
        </ProCard>
        <ProCard
          title={<FormattedMessage id="layout.system.dictionary.item" />}
          headerBordered
        >
          <ProTable
            search={{ labelWidth: 0 }}
            rowKey="id"
            actionRef={actionRef}
            pagination={{
              pageSize: 10,
            }}
            params={{ pkDictGroup: groupData?.id }}
            request={async (params) => {
              if (
                selectedRowKeys.length !== 0 &&
                selectedRowKeys[0] !== groupData?.id
              ) {
                return itemPagination;
              }
              if (groupData?.id === undefined) {
                return {
                  data: [],
                  success: true,
                };
              }
              const res = await queryDictItemList({ ...params });
              setItemPagination({
                data: res.data?.result,
                total: res.data.total,
                current: res.data?.currentPage,
                pageSize: res.data?.pageSize,
              });
              return {
                data: res.data?.result,
                total: res.data.total,
                success: true,
              };
            }}
            toolBarRender={() => [
              <Button
                key="button"
                icon={<PlusOutlined />}
                type="primary"
                onClick={(e) =>
                  showDictItemModal(e as React.MouseEvent<HTMLAnchorElement>)
                }
              >
                <FormattedMessage id="layout.common.add" />
              </Button>,
            ]}
            columns={dictItems}
          />
        </ProCard>
      </ProCard>
      <Modal
        title={
          <>
            <FormattedMessage id="layout.system.dictionary.group" />
          </>
        }
        open={openGroup}
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={() => setOpenGroup(false)}
        onOk={() => setOpenGroup(true)}
        destroyOnClose
        width={300}
        modalRender={(dom) => (
          <Form
            form={groupForm}
            name="dictGroup"
            initialValues={groupData}
            clearOnDestroy
            onFinish={onGroupFinish}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item<DictGroupType>
          label={<FormattedMessage id="layout.system.dictionary.groupCode" />}
          name="code"
          rules={[{ required: true }]}
        >
          <Input
            placeholder={`${intl.formatMessage({
              id: 'layout.common.placeholderInput',
            })} ${intl.formatMessage({
              id: 'layout.system.dictionary.groupCode',
            })}`}
          />
        </Form.Item>
        <Form.Item<DictGroupType>
          label={<FormattedMessage id="layout.system.dictionary.groupName" />}
          name="name"
          rules={[{ required: true }]}
        >
          <Input
            placeholder={`${intl.formatMessage({
              id: 'layout.common.placeholderInput',
            })} ${intl.formatMessage({
              id: 'layout.system.dictionary.groupName',
            })}`}
          />
        </Form.Item>
      </Modal>
      <Modal
        title={<FormattedMessage id="layout.system.dictionary.item" />}
        open={openItem}
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={() => setOpenItem(false)}
        onOk={() => setOpenItem(true)}
        width={450}
        destroyOnClose
        modalRender={(dom) => (
          <Form
            form={itemForm}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 19 }}
            name="dictItem"
            initialValues={itemData}
            clearOnDestroy
            onFinish={onItemFinish}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item<DictItemType>
          label={intl.formatMessage({ id: 'layout.system.dictionary.item' })}
          name="name"
          rules={[{ required: true }]}
        >
          <Input
            placeholder={`${intl.formatMessage({
              id: 'layout.common.placeholderInput',
            })} ${intl.formatMessage({ id: 'layout.system.dictionary.item' })}`}
          />
        </Form.Item>
        <Form.Item<DictItemType>
          label={intl.formatMessage({ id: 'layout.system.dictionary.value' })}
          name="value"
          rules={[{ required: true }]}
        >
          <Input
            placeholder={`${intl.formatMessage({
              id: 'layout.common.placeholderInput',
            })} ${intl.formatMessage({
              id: 'layout.system.dictionary.value',
            })}`}
          />
        </Form.Item>
      </Modal>
    </PageContainer>
  );
};

export default DictList;
