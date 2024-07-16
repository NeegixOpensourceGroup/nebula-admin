import services from '@/services/demo';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProCard,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, message, Tree, Input, TreeDataNode } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import  dictServices from '@/services/dict';
import styles from './index.less';
import  bizUnitServices  from '@/services/bizUnit';
import BizUnitSelectTree from '@/components/BizUnitSelectTree';

const { Search } = Input;
const { queryDictItemByDictCode } = dictServices.DictController;
const { queryOrgById, } = bizUnitServices.BizUnitController;
const { addUser, queryUserList, deleteUser, modifyUser } =
  services.UserController;

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.UserInfo) => {
  const hide = message.loading('正在添加');
  try {
    await addUser({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在配置');
  try {
    await modifyUser(
      {
        userId: fields.id || '',
      },
      {
        name: fields.name || '',
        nickName: fields.nickName || '',
        email: fields.email || '',
      },
    );
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserInfo[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteUser({
      userId: selectedRows.find((row) => row.id)?.id || '',
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const dataList: { key: React.Key; title: string }[] = [];
const generateList = (data: any[]) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key, title } = node;
    // Convert title to string if it's a ReactNode or a function
    let titleString: string;

    if (typeof title === 'function') {
      const titleNode = title(node);
      titleString = typeof titleNode === 'string' ? titleNode : titleNode?.toString() ?? '';
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

const PsnList: React.FC<unknown> = () => {

  const [messageApi, contextHolder] = message.useMessage();

  /// 左侧树-START
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [defaultTreeData, setDefaultTreeData] = useState<any[]>([]);
 /// 左侧树-END

  /// 右侧列表-START
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserInfo[]>([]);
  const [sexData, setSexData] = useState<any>({});
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
        .filter((item, i, self): item is React.Key => !!(item && self.indexOf(item) === i));
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
        if(defaultTreeData.length === 0){
          return []
        }
        const data = loop(defaultTreeData);
      return data;
    }, [searchValue, defaultTreeData]);
    /// 左侧树-END


  useEffect(() => {
    // 查询性别字典
    queryDictItemByDictCode('XB').then((res) => {
      if (res.code === 200) {
        const enumObject:any = {};
        res.data.forEach((item:any) => {
          enumObject[item.id] = item.name;
        });
        setSexData(enumObject);
      }
    });
  }, []);
  const columns: ProColumns<API.UserInfo>[] = [
    {
      title: '编码',
      dataIndex: 'code',
      tooltip: '编码是唯一的 key',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '编码为必填项',
          },
        ],
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '名称为必填项',
          },
        ],
      },
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      valueType: 'text',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      valueEnum: sexData,
    },
    {
      title: '操作',
      dataIndex: 'option',
      width: 150,
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            更新
          </a>
          <Divider type="vertical" />
          <a href="">删除</a>
        </>
      ),
    },
  ];



  return (
    <PageContainer
      header={{
        title: '人员管理',
      }}
    >
      {contextHolder}
        <ProCard title={
          <BizUnitSelectTree />
        } split="vertical" bordered headerBordered >
          <ProCard title="部门" colSpan="20%" >
            <Search style={{ marginBottom: 8 }} placeholder="查询" onChange={onChange} />
            <Tree
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              //selectedKeys={checkedKey?[checkedKey]:[]}
              onSelect={async ( selectedKeys) => {
                  if (selectedKeys.length > 0) {
                    const res = await queryOrgById(Number(selectedKeys[0]));
                    if (res.code === 200) {
                      // formRef?.current?.resetFields();
                      // const parentNode = getParentNode(Number(selectedKeys[0]), defaultTreeData);
                      // setCurrentNodeData(res.data)
                      // setParentNodeData(parentNode);
                      // setCheckedKey(Number(selectedKeys[0]))
                    } else {
                    }
                  } else {
                    // setCurrentNodeData(null)
                    // setParentNodeData(null)
                    // setCheckedKey(undefined)
                  }
                  
                }
              }
              treeData={treeData}
            />
          </ProCard>
          <ProCard title="人员" colSpan="80%" >
            <ProTable<API.UserInfo>
              headerTitle="查询表格"
              actionRef={actionRef}
              rowKey="id"
              search={{
                labelWidth: 50,
              }}
              toolBarRender={() => [
                <Button
                  key="1"
                  type="primary"
                  onClick={() => handleModalVisible(true)}
                >
                  新建
                </Button>,
              ]}
              request={async (params, sorter, filter) => {
                const { data, success } = await queryUserList({
                  ...params,
                  // FIXME: remove @ts-ignore
                  // @ts-ignore
                  sorter,
                  filter,
                });
                return {
                  data: data?.list || [],
                  success,
                };
              }}
              columns={columns}
              rowSelection={{
                onChange: (_, selectedRows) => setSelectedRows(selectedRows),
              }}
            />
            {selectedRowsState?.length > 0 && (
              <FooterToolbar
                extra={
                  <div>
                    已选择{' '}
                    <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
                    项&nbsp;&nbsp;
                  </div>
                }
              >
                <Button
                  onClick={async () => {
                    await handleRemove(selectedRowsState);
                    setSelectedRows([]);
                    actionRef.current?.reloadAndRest?.();
                  }}
                >
                  批量删除
                </Button>
                <Button type="primary">批量审批</Button>
              </FooterToolbar>
            )}
            <CreateForm
              onCancel={() => handleModalVisible(false)}
              modalVisible={createModalVisible}
            >
              <ProTable<API.UserInfo, API.UserInfo>
                onSubmit={async (value) => {
                  const success = await handleAdd(value);
                  if (success) {
                    handleModalVisible(false);
                    if (actionRef.current) {
                      actionRef.current.reload();
                    }
                  }
                }}
                rowKey="id"
                type="form"
                columns={columns}
              />
            </CreateForm>
            {stepFormValues && Object.keys(stepFormValues).length ? (
              <UpdateForm
                onSubmit={async (value) => {
                  const success = await handleUpdate(value);
                  if (success) {
                    handleUpdateModalVisible(false);
                    setStepFormValues({});
                    if (actionRef.current) {
                      actionRef.current.reload();
                    }
                  }
                }}
                onCancel={() => {
                  handleUpdateModalVisible(false);
                  setStepFormValues({});
                }}
                updateModalVisible={updateModalVisible}
                values={stepFormValues}
              />
            ) : null}
          </ProCard>
        </ProCard>
    </PageContainer>
  );
};

export default PsnList;
