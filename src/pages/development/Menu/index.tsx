import menuServices from '@/services/development/menu';
import { buildTreeData, getParentNode } from '@/utils/tools';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import type { TreeDataNode } from 'antd';
import {
  Button,
  Empty,
  Flex,
  Input,
  Popconfirm,
  Space,
  Tree,
  message,
} from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './index.less';
const { queryMenuList, queryMenuById, createMenu, updateMenu, deleteMenu } =
  menuServices.MenuController;
const { Search } = Input;

enum FormStatus {
  ROOT, // 根节点
  CREAT_ROOT, // 创建根节点
  NO_DATA, // 暂无数据
  CREAT_CHILD, // 创建子节点
  EDIT_NODE, // 编辑节点
  VIEW_NODE, // 查看节点
}

const dataList: { key: React.Key; title: string }[] = [];
const generateList = (data: TreeDataNode[]) => {
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

const _setFormFieldValues = (
  data: any,
  formRef: any,
  parentNode: TreeDataNode | null,
) => {
  //const parentNode = getParentNode(Number(checkedKey), defaultData);
  if (parentNode) {
    formRef?.current?.setFieldsValue({
      ...data,
      pName: parentNode.title, // 安全地访问 title 属性
    });
  } else {
    formRef?.current?.setFieldsValue({
      ...data,
      pName: '', // parentNode 为 null 或 undefined 时的默认值
    });
  }
};
const BizUnitList: React.FC<unknown> = () => {
  const [messageApi, contextHolder] = message.useMessage();
  /// 左侧树-START
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [defaultTreeData, setDefaultTreeData] = useState<TreeDataNode[]>([]);
  /// 左侧树-END

  /// 表单-START
  const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.ROOT);
  const formRef = useRef<any>();
  const [checkedKey, setCheckedKey] = useState<number | string>();
  const [currentNodeData, setCurrentNodeData] = useState<any>({});
  const [parentNodeData, setParentNodeData] = useState<any>({});
  /// 表单-END

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
  const refreshTreeHandler = async () => {
    const res = await queryMenuList();
    const treeData = buildTreeData(res.data, {
      idKey: 'id',
      nameKey: 'name',
      pidKey: 'pid',
    });
    setDefaultTreeData(treeData);
    generateList(treeData);
    return treeData;
  };
  /// 左侧树-END

  useEffect(() => {
    const queryOrgs = async () => {
      await refreshTreeHandler();
      setFormStatus(FormStatus.ROOT);
    };
    queryOrgs();
  }, []);

  /// 表单-START

  // 编辑 界面
  const openEditHandler = () => {
    setFormStatus(FormStatus.EDIT_NODE);
  };

  // 新增 子节点界面
  const openAddSubHandler = async () => {
    formRef?.current?.resetFields();
    if (checkedKey === undefined) {
      messageApi.error('请选择要新增的节点');
      return;
    }
    formRef?.current?.setFieldsValue({
      pName: currentNodeData.name,
      type: currentNodeData.type === 3 ? 3 : null,
    });
    setFormStatus(FormStatus.CREAT_CHILD);
  };

  // 新增 根节点子界面
  const openAddRootHandler = () => {
    formRef?.current?.setFieldsValue({ type: 1 });
    setFormStatus(FormStatus.CREAT_ROOT);
  };

  //
  const cancleHandler = async () => {
    if (checkedKey !== undefined) {
      if (currentNodeData) {
        _setFormFieldValues(currentNodeData, formRef, parentNodeData);
        setFormStatus(FormStatus.VIEW_NODE);
      } else {
        setFormStatus(FormStatus.NO_DATA);
      }
    } else {
      formRef?.current?.resetFields();
      setFormStatus(FormStatus.ROOT);
    }
  };

  const deleteHanlder = async () => {
    if (checkedKey !== undefined) {
      const res = await deleteMenu(checkedKey);
      if (res.code === 200) {
        await refreshTreeHandler();
        setFormStatus(FormStatus.ROOT);
        formRef?.current?.resetFields();
        messageApi.success('删除成功');
      }
    }
  };
  /// 表单-END

  return (
    <PageContainer
      header={{
        title: '菜单管理',
      }}
    >
      {contextHolder}
      <ProCard split="vertical">
        <ProCard title="菜单" colSpan="20%">
          <Search
            style={{ marginBottom: 8 }}
            placeholder="查询"
            onChange={onChange}
          />
          <Tree
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            selectedKeys={checkedKey ? [checkedKey] : []}
            onSelect={async (selectedKeys) => {
              if (selectedKeys.length > 0) {
                const res = await queryMenuById(Number(selectedKeys[0]));
                if (res.code === 200) {
                  formRef?.current?.resetFields();
                  const parentNode = getParentNode(
                    Number(selectedKeys[0]),
                    defaultTreeData,
                  );
                  setCurrentNodeData(res.data);
                  setParentNodeData(parentNode);
                  setCheckedKey(Number(selectedKeys[0]));
                  _setFormFieldValues(res.data, formRef, parentNode);
                  setFormStatus(FormStatus.VIEW_NODE);
                } else {
                  setFormStatus(FormStatus.NO_DATA);
                }
              } else {
                formRef?.current?.resetFields();
                setCurrentNodeData(null);
                setParentNodeData(null);
                setCheckedKey(undefined);
                setFormStatus(FormStatus.ROOT);
              }
            }}
            treeData={treeData}
          />
        </ProCard>
        <ProCard
          title={`菜单信息${
            formStatus === FormStatus.VIEW_NODE
              ? '-查看'
              : formStatus === FormStatus.EDIT_NODE
              ? '-编辑'
              : formStatus === FormStatus.CREAT_CHILD
              ? '-新增子级'
              : formStatus === FormStatus.CREAT_ROOT
              ? '-新增根级'
              : ''
          }`}
          headerBordered
          style={{ minHeight: '500px' }}
          extra={
            <Space>
              {formStatus === FormStatus.VIEW_NODE ? (
                <>
                  <Button onClick={openEditHandler}>编辑</Button>
                  {currentNodeData.type !== 2 ? (
                    <Button type="primary" onClick={openAddSubHandler}>
                      新增子级
                    </Button>
                  ) : null}
                  <Popconfirm
                    title="警告"
                    description={`确认删除当前的${
                      currentNodeData.type === 1 ? '菜单' : '按钮'
                    }?`}
                    onConfirm={deleteHanlder}
                    okText="是"
                    cancelText="否"
                  >
                    <Button danger type="primary">
                      删除
                    </Button>
                  </Popconfirm>
                </>
              ) : null}
              {formStatus === FormStatus.CREAT_ROOT ||
              formStatus === FormStatus.CREAT_CHILD ||
              formStatus === FormStatus.EDIT_NODE ? (
                <Button danger onClick={cancleHandler}>
                  取消
                </Button>
              ) : null}
            </Space>
          }
        >
          <ProForm
            hidden={
              formStatus === FormStatus.ROOT ||
              formStatus === FormStatus.NO_DATA
            }
            formRef={formRef}
            grid={true}
            readonly={
              formStatus === FormStatus.CREAT_ROOT ||
              formStatus === FormStatus.CREAT_CHILD ||
              formStatus === FormStatus.EDIT_NODE
                ? false
                : true
            }
            onFinish={async () => {
              const values = formRef.current?.getFieldsValue();
              let pid: number = 0;
              if (parentNodeData) {
                pid = Number(parentNodeData.key);
              }

              if (
                formStatus === FormStatus.CREAT_ROOT ||
                formStatus === FormStatus.CREAT_CHILD
              ) {
                const pid =
                  formStatus === FormStatus.CREAT_ROOT ? 0 : Number(checkedKey);
                const res = await createMenu({ ...values, pid });
                if (res.code === 200) {
                  await refreshTreeHandler();
                  setFormStatus(FormStatus.VIEW_NODE);
                  setExpandedKeys([res.data.id]);
                  setAutoExpandParent(true);
                  setCheckedKey(res.data.id);
                  setParentNodeData({
                    key: currentNodeData.id,
                    title: currentNodeData.name,
                  });
                  setCurrentNodeData({ ...values, pid, id: res.data.id });
                  messageApi.success('提交成功');
                }
              }
              if (formStatus === FormStatus.EDIT_NODE) {
                const res = await updateMenu(Number(checkedKey), {
                  ...values,
                  pid,
                });
                if (res.code === 200) {
                  await refreshTreeHandler();
                  setCurrentNodeData({
                    ...values,
                    pid,
                    id: Number(checkedKey),
                  });
                  setFormStatus(FormStatus.VIEW_NODE);
                  messageApi.success('提交成功');
                }
              }
            }}
            onReset={() => {
              if (formStatus === FormStatus.CREAT_ROOT) {
                formRef.current?.setFieldsValue({
                  type: 1,
                });
              }
              if (formStatus === FormStatus.CREAT_CHILD) {
                formRef.current?.setFieldsValue({
                  id: currentNodeData?.id,
                  pid: currentNodeData?.pid,
                  pName: currentNodeData?.name,
                });
              }

              if (formStatus === FormStatus.EDIT_NODE) {
                formRef.current?.setFieldsValue({
                  id: currentNodeData?.id,
                  code: currentNodeData?.code,
                  type: currentNodeData?.type,
                  pid: currentNodeData?.pid,
                  pName: parentNodeData?.title,
                });
              }
            }}
            submitter={{
              render: (props, doms) => {
                return formStatus !== FormStatus.VIEW_NODE ? (
                  <Flex justify="flex-end" align="center">
                    <Space>{doms}</Space>
                  </Flex>
                ) : null;
              },
            }}
            initialValues={{
              id: null,
              name: '',
              pid: 0,
              code: '',
              simpleName: '',
              tel: '',
              type: null,
              manager: '',
              phone: '',
              remark: '',
            }}
            autoFocusFirstInput
          >
            <ProFormRadio.Group
              colProps={{ span: 12 }}
              label="类型"
              name="type"
              rules={[
                {
                  required: true,
                  message: '请选择类型',
                },
              ]}
              readonly={formStatus === FormStatus.EDIT_NODE}
              options={[
                {
                  label: '菜单',
                  value: 1,
                },
                {
                  label: '按钮',
                  value: 2,
                },
              ]}
            />
            <ProFormText
              colProps={{ span: 12 }}
              width="md"
              name="pName"
              readonly={true}
              label="上级菜单名称"
            />
            <ProFormText
              colProps={{ span: 12 }}
              width="md"
              name="name"
              label="名称"
              placeholder="请输入名称"
              rules={[{ required: true }]}
            />
            <ProFormText
              colProps={{ span: 12 }}
              width="md"
              name="access"
              label="权限识别码"
              placeholder="请输入简称"
            />
            <ProFormTextArea width="xl" label="备注" name="remark" />
          </ProForm>
          <Empty
            style={{
              display:
                formStatus === FormStatus.NO_DATA ||
                formStatus === FormStatus.ROOT
                  ? 'block'
                  : 'none',
            }}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button
              hidden={formStatus !== FormStatus.ROOT}
              type="primary"
              onClick={openAddRootHandler}
            >
              创建菜单
            </Button>
          </Empty>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default BizUnitList;
