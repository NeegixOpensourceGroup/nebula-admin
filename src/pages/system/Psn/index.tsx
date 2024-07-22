import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProCard,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, message, Tree, Input, TreeDataNode, Space, Popconfirm } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import  dictServices from '@/services/dict';
import styles from './index.less';
import BizUnitSelectTree from '@/components/BizUnitSelectTree';
import deptServices  from '@/services/dept';
import psnServices from '@/services/psn';
import { buildTreeData } from '@/utils/tools';

const { Search } = Input;
const { queryDictItemByDictCode } = dictServices.DictController;
const {queryDeptList} = deptServices.DeptController;
const { queryUserList, deletePsn, addPsn, updatePsn } = psnServices.PsnController;




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
  const [bizUnitId, setBizUnitId] = useState<number|string>(1);
  /// 左侧树-START
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [defaultTreeData, setDefaultTreeData] = useState<any[]>([]);
  const [checkedKey, setCheckedKey] = useState<number|string>();
 /// 左侧树-END

  /// 右侧列表-START
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.PsnInfo[]>([]);
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

  const onSubmit = async (values: any) => {
    const hide = messageApi.loading('正在添加');
    if (!values.bizUnitPk) {
      messageApi.error('请选择业务单元');
      return false;
    }
    try {
      if (!values.id) {
        const res = await addPsn(values);
        if (res.code === 200) {
          hide();
          messageApi.success(res.message);
          actionRef.current?.reload();
          return true;
        } else {
          hide();
          messageApi.error(res.message);
          return false;
        }
      } else {
        const res = await updatePsn(values.id, values);
        if (res.code === 200) {
          hide();
          messageApi.success(res.message);
          actionRef.current?.reload();
          return true;
        } else {
          hide();
          messageApi.error(res.message);
          return false;
        }
      }
      
    } catch (error) {
     hide();
     return false;
    }
  }

  const handleSingleRemove = async(id: number|string) => {
    const hide = messageApi.loading('正在删除');
    try {
      await deletePsn(id);
      actionRef.current?.reload();
      hide();
      messageApi.success('删除成功，即将刷新');
      return true;
    } catch (error) {
      hide();
      messageApi.error('删除失败，请重试');
      return false;
    }
  }

  /**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.PsnInfo[]) => {
  const hide = messageApi.loading('正在删除');
  if (!selectedRows) return true;
  try {
    
    console.log(selectedRows)
    const res  = await deletePsn(selectedRows.map(item=>item.id).join(","));
    if(res.code === 200){
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

  const columns: ProColumns<API.PsnInfo>[] = [
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
      dataIndex: 'nickname',
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
          <UpdateForm key={'updateForm'} id={record.id}  bizUnitId={bizUnitId} onSubmit={onSubmit}/>
          <Divider type="vertical" />
          <Popconfirm
            title="警告"
            description="确认删除当前组织?"
            onConfirm={()=> (record.id !== undefined ? handleSingleRemove(record.id) : null)}
            okText="是"
            cancelText="否"
          >
            <a>删除</a>
          </Popconfirm>
          
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
          <Space>
            <BizUnitSelectTree onChange={async (value: string) => {
              const res = await queryDeptList(value);
              if (res.code === 200) {
                const treeData = buildTreeData(res.data, {
                  idKey: 'id',
                  nameKey: 'name',
                  pidKey: 'pid'
                })
                setDefaultTreeData(treeData)
                generateList(treeData);
                setBizUnitId(parseInt(value))
                setCheckedKey(undefined)
              }
            }}/>
          </Space>
        } split="vertical" bordered headerBordered >
          <ProCard title="部门" colSpan="20%" >
            <Search style={{ marginBottom: 8 }} placeholder="查询" onChange={onChange} />
            <Tree
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onSelect={async ( selectedKeys) => {
                  if (selectedKeys.length > 0) {
                    setCheckedKey(Number(selectedKeys[0]))
                  } else {
                    setCheckedKey(undefined)
                  }
                  
                }
              }
              treeData={treeData}
            />
          </ProCard>
          <ProCard title="人员" colSpan="80%" >
            <ProTable<API.PsnInfo>
              headerTitle="查询表格"
              actionRef={actionRef}
              rowKey="id"
              search={{
                labelWidth: 50,
              }}
              toolBarRender={() => [
                <CreateForm key={"userForm"} bizUnitId={bizUnitId} onSubmit={onSubmit} />,
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
          </ProCard>
        </ProCard>
    </PageContainer>
  );
};

export default PsnList;
