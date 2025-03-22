import BizUnitSelectTree from '@/components/BizUnitSelectTree';
import deptServices from '@/services/organization/dept';
import postServices from '@/services/organization/post';
import { buildTreeData } from '@/utils/tools';
import { DeleteTwoTone, EyeTwoTone } from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProCard,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import {
  Button,
  Input,
  message,
  Popconfirm,
  Space,
  Tree,
  TreeDataNode,
} from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { useIntl } from 'umi';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import styles from './index.less';

const { Search } = Input;
// const { queryDictItemByDictCode } = dictServices.DictController;
const { queryDeptList } = deptServices.DeptController;
const { queryPostList, deletePost } = postServices.PostController;

const dataList: { key: React.Key; title: string }[] = [];
const generateList = (data: any[]) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key, title } = node;
    // Convert title to string if it's a ReactNode or a function
    let titleString: string;

    if (typeof title === 'function') {
      const titleNode = title(node);
      titleString =
        typeof titleNode === 'string' ? titleNode : titleNode?.toString() ?? '';
    } else if (typeof title === 'string') {
      titleString = title;
    } else {
      titleString = title?.toString() ?? '';
    }

    dataList.push({ key, title: titleString });
    if (node.children) {
      generateList(node.children);
    }
  }
};

const getParentKey = (key: React.Key, tree: TreeDataNode[]): React.Key => {
  let parentKey: React.Key;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey!;
};

type PostItem = {
  id: number;
  code: string;
  name: string;
  enabled: boolean;
  created_at: string;
};

const PostList: React.FC<unknown> = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const intl = useIntl();
  const [pkBizUnit, setPkBizUnit] = useState<number | string>(1);
  /// 左侧树-START
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [defaultTreeData, setDefaultTreeData] = useState<any[]>([]);
  const [checkedKey, setCheckedKey] = useState<number | string>();
  /// 左侧树-END

  /// 右侧列表-START
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.PsnInfo[]>([]);
  /// 左侧列表-END

  /// 左侧树-START
  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newExpandedKeys = dataList
      .map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, defaultTreeData);
        }
        return null;
      })
      .filter(
        (item, i, self): item is React.Key =>
          !!(item && self.indexOf(item) === i),
      );
    setExpandedKeys(newExpandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  let treeData = useMemo(() => {
    const loop = (data: TreeDataNode[]): TreeDataNode[] =>
      data.map((item) => {
        const strTitle = item.title as string;
        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span key={item.key}>
              {beforeStr}
              <span className={styles.siteTreeSearchValue}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span key={item.key}>{strTitle}</span>
          );
        if (item.children) {
          return { title, key: item.key, children: loop(item.children) };
        }

        return {
          title,
          key: item.key,
        };
      });
    if (defaultTreeData.length === 0) {
      return [];
    }
    const data = loop(defaultTreeData);
    return data;
  }, [searchValue, defaultTreeData]);
  /// 左侧树-END

  // const onSubmit = async (values: any) => {
  //   const hide = messageApi.loading('正在添加');
  //   if (!values.bizUnitPk) {
  //     messageApi.error('请选择业务单元');
  //     return false;
  //   }
  //   try {
  //     if (!values.id) {
  //       const res = await addPsn(values);
  //       if (res.code === 200) {
  //         hide();
  //         messageApi.success(res.message);
  //         actionRef.current?.reload();
  //         return true;
  //       } else {
  //         hide();
  //         messageApi.error(res.message);
  //         return false;
  //       }
  //     } else {
  //       const res = await updatePsn(values.id, values);
  //       if (res.code === 200) {
  //         hide();
  //         messageApi.success(res.message);
  //         actionRef.current?.reload();
  //         return true;
  //       } else {
  //         hide();
  //         messageApi.error(res.message);
  //         return false;
  //       }
  //     }
  //   } catch (error) {
  //     hide();
  //     return false;
  //   }
  // };

  // const handleSingleRemove = async (id: number | string) => {
  //   const hide = messageApi.loading('正在删除');
  //   try {
  //     await deletePost(id);
  //     actionRef.current?.reload();
  //     hide();
  //     messageApi.success('删除成功，即将刷新');
  //     return true;
  //   } catch (error) {
  //     hide();
  //     messageApi.error('删除失败，请重试');
  //     return false;
  //   }
  // };

  /**
   *  删除节点
   * @param selectedRows
   */
  const handleRemove = async (selectedRows: API.PsnInfo[]) => {
    const hide = messageApi.loading('正在删除');
    if (!selectedRows) return true;
    try {
      const res = await deletePost(selectedRows.map((item) => item.id));
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

  const columns: ProColumns<PostItem>[] = [
    {
      title: intl.formatMessage({ id: 'layout.organization.position.code' }),
      dataIndex: 'code',
    },
    {
      title: intl.formatMessage({ id: 'layout.organization.position.name' }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({ id: 'layout.organization.position.enabled' }),
      dataIndex: 'enabled',
      valueType: 'select',
      valueEnum: {
        1: { text: '启用', status: 'Processing' },
        0: { text: '禁用', status: 'Default' },
      },
    },
    {
      title: intl.formatMessage({
        id: 'layout.organization.position.createTime',
      }),
      dataIndex: 'created_at',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({
        id: 'layout.organization.position.createTime',
      }),
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
      title: intl.formatMessage({ id: 'layout.common.operate' }),
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <UpdateForm
          key={'updateForm'}
          id={record.id}
          pkBizUnit={pkBizUnit}
          pkDept={checkedKey}
          actionRef={action}
        />,
        <EyeTwoTone
          key="view"
          title={intl.formatMessage({ id: 'layout.common.view' })}
        />,
        <Popconfirm
          title={<FormattedMessage id="layout.common.warning" />}
          key="remove"
          description={
            <FormattedMessage
              id={'layout.organization.position.message.sure'}
            />
          }
          onConfirm={async () => {
            const res = await deletePost([record.id]);
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

  return (
    <>
      {contextHolder}
      <PageContainer
        header={{
          title: (
            <>
              <FormattedMessage id="layout.organization.position.title" />{' '}
              <FormattedMessage id="layout.common.management" />
            </>
          ),
        }}
      >
        <ProCard
          title={
            <Space>
              <BizUnitSelectTree
                onChange={async (value: string) => {
                  const res = await queryDeptList(value);
                  if (res.code === 200) {
                    const treeData = buildTreeData(res.data, {
                      idKey: 'id',
                      nameKey: 'name',
                      pidKey: 'pid',
                    });
                    setDefaultTreeData(treeData);
                    generateList(treeData);
                    setPkBizUnit(parseInt(value));
                    setCheckedKey(undefined);
                  }
                }}
              />
            </Space>
          }
          split="vertical"
          bordered
          headerBordered
        >
          <ProCard
            title={<FormattedMessage id="layout.organization.dept.title" />}
            colSpan="20%"
          >
            <Search
              style={{ marginBottom: 8 }}
              placeholder={intl.formatMessage({ id: 'layout.common.search' })}
              onChange={onChange}
            />
            <Tree
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onSelect={async (selectedKeys) => {
                if (selectedKeys.length > 0) {
                  setCheckedKey(Number(selectedKeys[0]));
                } else {
                  setCheckedKey(undefined);
                }
              }}
              treeData={treeData}
            />
          </ProCard>
          <ProCard
            title={<FormattedMessage id="layout.organization.position.title" />}
            colSpan="80%"
          >
            <ProTable<PostItem>
              actionRef={actionRef}
              rowKey="id"
              search={{
                labelWidth: 'auto',
              }}
              toolBarRender={() => [
                <CreateForm
                  key={'userForm'}
                  actionRef={actionRef.current}
                  pkBizUnit={pkBizUnit}
                  pkDept={checkedKey}
                />,
              ]}
              params={{ pkBizUnit, pkDept: checkedKey }}
              request={async (params, sorter, filter) => {
                const { data, code } = await queryPostList({
                  ...params,
                  // FIXME: remove @ts-ignore
                  // @ts-ignore
                  sorter,
                  filter,
                });
                return {
                  data: data?.result || [],
                  success: code === 200,
                };
              }}
              columns={columns}
              rowSelection={{
                onChange: (_, selectedRows) => setSelectedRows(selectedRows),
              }}
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
          </ProCard>
        </ProCard>
      </PageContainer>
    </>
  );
};

export default PostList;
