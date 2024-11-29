import services from '@/services/system/dict';
import { PlusOutlined } from '@ant-design/icons';
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
  const [groupDataSource, setGroupDataSource] = useState<DictGroupDataType[]>(
    [],
  );
  const [itemData, setItemData] = useState<DictItemDataType>();
  const [groupPagination, setGroupPagination] = useState<Pagination>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const actionRef = useRef<ActionType | null>(null);

  useEffect(() => {
    const queryDictGroupFun = async () => {
      const res = await queryDictList({ ...groupPagination });
      setGroupDataSource(res.data?.result);
      setGroupPagination({
        current: res.data?.currentPage,
        pageSize: res.data?.pageSize,
        total: res.data?.total,
      });
    };

    queryDictGroupFun();
  }, []);

  const onSearch: SearchProps['onSearch'] = async (value) => {
    if (value) {
      const res = await queryDictList({ ...groupPagination, name: value });
      setGroupDataSource(res.data?.result);
      setGroupPagination({
        current: res.data?.currentPage,
        pageSize: res.data?.pageSize,
        total: res.data?.total,
      });
    } else {
      const res = await queryDictList({ ...groupPagination });
      setGroupDataSource(res.data?.result);
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
    const resList = await queryDictList({ ...groupPagination });
    setGroupDataSource(resList.data?.result);
    setGroupPagination({
      current: resList.data?.currentPage,
      pageSize: resList.data?.pageSize,
      total: resList.data?.total,
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
      const resList = await queryDictList({ ...groupPagination });
      setGroupDataSource(resList.data?.result);
      setGroupPagination({
        current: resList.data?.currentPage,
        pageSize: resList.data?.pageSize,
        total: resList.data?.total,
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
    const res = await removeDictItem(groupData?.id || 1, itemData?.id || 1);
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
    if (itemData?.id) {
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
      title: intl.formatMessage({ id: 'layout.system.dictionary.group' }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: intl.formatMessage({ id: 'layout.common.operate' }),
      key: 'action',
      width: 80,
      render: (_e, record) => (
        <Space size="middle">
          <a
            onClick={(e) =>
              showDictGroupModal(
                e as React.MouseEvent<HTMLAnchorElement>,
                record,
              )
            }
          >
            <FormattedMessage id="layout.common.edit" />
          </a>
          <Popconfirm
            title={
              <FormattedMessage id="layout.system.dictionary.message.group.sure" />
            }
            onConfirm={confirmGroup}
            onCancel={cancel}
          >
            <a
              onClick={(e) => {
                e.stopPropagation();
                setGroupData(record);
              }}
            >
              <FormattedMessage id="layout.common.delete" />
            </a>
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
          <a
            onClick={(e) =>
              showDictItemModal(
                e as React.MouseEvent<HTMLAnchorElement>,
                record,
              )
            }
          >
            <FormattedMessage id="layout.common.edit" />
          </a>
          <Popconfirm
            title={
              <FormattedMessage id="layout.system.dictionary.message.sure" />
            }
            onConfirm={confirmItem}
            onCancel={cancel}
          >
            <a
              onClick={(e) => {
                e.stopPropagation();
                setItemData(record);
              }}
            >
              <FormattedMessage id="layout.common.delete" />
            </a>
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
          colSpan="25%"
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
              columns={dictGroups}
              dataSource={groupDataSource}
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
                    });
                    setGroupDataSource(res.data?.result);
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
            params={{ dictId: groupData?.id }}
            request={async (params) => {
              if (groupData?.id === undefined) {
                return {
                  data: [],
                  success: true,
                };
              }
              const res = await queryDictItemList({ ...params });
              return {
                data: res.data?.list,
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
