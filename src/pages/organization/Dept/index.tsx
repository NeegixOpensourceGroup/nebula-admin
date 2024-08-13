import BizUnitSelectTree from '@/components/BizUnitSelectTree';
import services from '@/services/organization/dept';
import { buildTreeData, getParentNode } from '@/utils/tools';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
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
import { useIntl } from 'umi';
import styles from './index.less';

const { queryDeptList, queryDeptById, updateDept, deleteDept, createDept } =
  services.DeptController;
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
const OrgList: React.FC<unknown> = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const intl = useIntl();
  const [bizUnitId, setBizUnitId] = useState<number | string>(1);
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
    const res = await queryDeptList(bizUnitId);
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
    setFormStatus(FormStatus.ROOT);
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
      messageApi.warning(<FormattedMessage id="layout.organization.select" />);
      return;
    }
    formRef?.current?.setFieldsValue({ pName: currentNodeData.name });
    setFormStatus(FormStatus.CREAT_CHILD);
  };

  // 新增 根节点子界面
  const openAddRootHandler = () => {
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
      const res = await deleteDept(checkedKey);
      if (res.code === 200) {
        await refreshTreeHandler();
        setFormStatus(FormStatus.ROOT);
        formRef?.current?.resetFields();
        messageApi.success(intl.formatMessage({ id: 'message.success' }));
      }
    }
  };
  /// 表单-END

  return (
    <PageContainer
      header={{
        title: (
          <>
            <FormattedMessage id="layout.organization.dept.title" />{' '}
            <FormattedMessage id="layout.common.management" />
          </>
        ),
      }}
    >
      {contextHolder}
      <ProCard
        split="vertical"
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
                  setBizUnitId(parseInt(value));
                  setFormStatus(FormStatus.ROOT);
                  setCheckedKey(undefined);
                  formRef?.current?.resetFields();
                }
              }}
            />
          </Space>
        }
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
            selectedKeys={checkedKey ? [checkedKey] : []}
            onSelect={async (selectedKeys) => {
              if (selectedKeys.length > 0) {
                const res = await queryDeptById(Number(selectedKeys[0]));
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
          title={`${intl.formatMessage({
            id: 'layout.organization.dept.title',
          })} ${intl.formatMessage({ id: 'layout.organization.info' })}${
            formStatus === FormStatus.VIEW_NODE
              ? `-${intl.formatMessage({ id: 'layout.common.view' })}`
              : formStatus === FormStatus.EDIT_NODE
              ? `-${intl.formatMessage({ id: 'layout.common.edit' })}`
              : formStatus === FormStatus.CREAT_CHILD
              ? `-${intl.formatMessage({
                  id: 'layout.common.add',
                })} ${intl.formatMessage({ id: 'layout.common.subNode' })}`
              : formStatus === FormStatus.CREAT_ROOT
              ? `-${intl.formatMessage({
                  id: 'layout.common.add',
                })} ${intl.formatMessage({ id: 'layout.common.rootNode' })}`
              : ''
          }`}
          headerBordered
          style={{ minHeight: '500px' }}
          extra={
            <Space>
              {formStatus === FormStatus.VIEW_NODE ? (
                <>
                  <Button onClick={openEditHandler}>
                    <FormattedMessage id="layout.common.edit" />
                  </Button>
                  <Button type="primary" onClick={openAddSubHandler}>
                    <FormattedMessage id="layout.common.add" />{' '}
                    <FormattedMessage id="layout.common.subNode" />
                  </Button>
                  <Popconfirm
                    title={<FormattedMessage id="layout.common.warning" />}
                    description={
                      <FormattedMessage id="layout.organization.dept.message.sure" />
                    }
                    onConfirm={deleteHanlder}
                  >
                    <Button danger type="primary">
                      <FormattedMessage id="layout.common.delete" />
                    </Button>
                  </Popconfirm>
                </>
              ) : null}
              {formStatus === FormStatus.CREAT_ROOT ||
              formStatus === FormStatus.CREAT_CHILD ||
              formStatus === FormStatus.EDIT_NODE ? (
                <Button danger onClick={cancleHandler}>
                  <FormattedMessage id="layout.common.cancel" />
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
                const res = await createDept(bizUnitId, { ...values, pid });
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
                  setCurrentNodeData({
                    ...values,
                    pid,
                    bizUnitId,
                    id: res.data.id,
                  });
                  messageApi.success(
                    intl.formatMessage({ id: 'layout.common.success' }),
                  );
                }
              }
              if (formStatus === FormStatus.EDIT_NODE) {
                const res = await updateDept(Number(checkedKey), {
                  ...values,
                  pid,
                  bizUnitId,
                });
                if (res.code === 200) {
                  await refreshTreeHandler();
                  setCurrentNodeData({
                    ...values,
                    pid,
                    bizUnitId,
                    id: Number(checkedKey),
                  });
                  setFormStatus(FormStatus.VIEW_NODE);
                  messageApi.success(
                    intl.formatMessage({ id: 'layout.common.success' }),
                  );
                }
              }
            }}
            onReset={() => {
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
              manager: '',
              phone: '',
              remark: '',
            }}
            autoFocusFirstInput
          >
            <ProFormText
              colProps={{ span: 12 }}
              width="md"
              name="pName"
              readonly={true}
              label={intl.formatMessage({
                id: 'layout.organization.dept.parent',
              })}
            />
            <ProFormText
              colProps={{ span: 12 }}
              width="md"
              name="code"
              readonly={formStatus === FormStatus.EDIT_NODE}
              label={intl.formatMessage({
                id: 'layout.organization.dept.code',
              })}
              rules={[{ required: true }]}
            />
            <ProFormText
              colProps={{ span: 12 }}
              width="md"
              name="name"
              label={intl.formatMessage({
                id: 'layout.organization.dept.name',
              })}
              rules={[{ required: true }]}
            />
            <ProFormText
              colProps={{ span: 12 }}
              width="md"
              name="simpleName"
              label={intl.formatMessage({
                id: 'layout.organization.dept.shortName',
              })}
            />
            <ProFormText
              colProps={{ span: 12 }}
              width="md"
              name="tel"
              label={intl.formatMessage({ id: 'layout.organization.dept.tel' })}
            />
            <ProFormText
              colProps={{ span: 12 }}
              width="md"
              name="manager"
              label={intl.formatMessage({
                id: 'layout.organization.dept.manager',
              })}
            />
            <ProFormText
              colProps={{ span: 12 }}
              width="md"
              name="phone"
              label={intl.formatMessage({
                id: 'layout.organization.dept.phone',
              })}
            />
            <ProFormTextArea
              width="xl"
              label={intl.formatMessage({
                id: 'layout.organization.dept.remark',
              })}
              name="remark"
            />
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
              <FormattedMessage id="layout.organization.dept.createRoot" />
            </Button>
          </Empty>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default OrgList;
