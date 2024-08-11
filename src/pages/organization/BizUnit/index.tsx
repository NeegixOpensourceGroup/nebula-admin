import services from '@/services/organization/bizUnit';
import { buildTreeData, getParentNode } from '@/utils/tools';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormRadio,
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

const {
  queryBizUnitList,
  queryBizUnitById,
  updateBizUnit,
  deleteBizUnit,
  createBizUnit,
} = services.BizUnitController;
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
  const intl = useIntl();
  /// 左侧树-START
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [defaultTreeData, setDefaultTreeData] = useState<TreeDataNode[]>([]);
  /// 左侧树-END

  /// 表单-START
  const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.ROOT);
  const formRef = useRef<any>();
  // const [formData, setFormData] = useState<any>({
  //   id: null,
  //   name: '',
  //   pid: 0,
  //   code: '',
  //   simpleName:''
  // });
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
    const res = await queryBizUnitList();
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
      const treeData = await refreshTreeHandler();
      setFormStatus(treeData.length > 0 ? FormStatus.NO_DATA : FormStatus.ROOT);
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
      messageApi.warning(<FormattedMessage id="layout.organization.select" />);
      return;
    }
    formRef?.current?.setFieldsValue({
      pName: currentNodeData.name,
      orgType: currentNodeData.orgType === 3 ? 3 : null,
    });
    setFormStatus(FormStatus.CREAT_CHILD);
  };

  // 新增 根节点子界面
  const openAddRootHandler = () => {
    formRef?.current?.setFieldsValue({ orgType: 1 });
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
    }
    setFormStatus(treeData.length > 0 ? FormStatus.VIEW_NODE : FormStatus.ROOT);
  };

  const deleteHanlder = async () => {
    if (checkedKey !== undefined) {
      const res = await deleteBizUnit(checkedKey);
      if (res.code === 200) {
        const treeList = await refreshTreeHandler();
        setFormStatus(
          !treeList || treeList.length === 0
            ? FormStatus.ROOT
            : FormStatus.NO_DATA,
        );
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
            <FormattedMessage id="layout.organization.bizUnit.title" />{' '}
            <FormattedMessage id="layout.organization.management" />
          </>
        ),
      }}
    >
      {contextHolder}
      <ProCard split="vertical">
        <ProCard
          title={<FormattedMessage id="layout.organization.bizUnit.title" />}
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
                const res = await queryBizUnitById(Number(selectedKeys[0]));
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
                setCurrentNodeData(null);
                setParentNodeData(null);
                setCheckedKey(undefined);
                setFormStatus(FormStatus.NO_DATA);
              }
            }}
            treeData={treeData}
          />
        </ProCard>
        <ProCard
          title={`${intl.formatMessage({
            id: 'layout.organization.bizUnit.title',
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
                      <FormattedMessage id="layout.organization.bizUnit.message.sure" />
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
                const res = await createBizUnit({ ...values, pid });
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
                  messageApi.success(<FormattedMessage id="message.success" />);
                }
              }
              if (formStatus === FormStatus.EDIT_NODE) {
                const res = await updateBizUnit(Number(checkedKey), {
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
                  messageApi.success(<FormattedMessage id="message.success" />);
                }
              }
            }}
            onReset={() => {
              if (formStatus === FormStatus.CREAT_ROOT) {
                formRef.current?.setFieldsValue({
                  orgType: 1,
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
                  orgType: currentNodeData?.orgType,
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
            // syncToUrl={(values, type) => {
            //   console.log('syncToUrl', values, type)
            //   if (type === 'get') {
            //     // 为了配合 transform
            //     // startTime 和 endTime 拼成 createTimeRanger
            //     return {
            //       ...values,
            //       createTimeRanger:
            //         values.startTime || values.endTime
            //           ? [values.startTime, values.endTime]
            //           : undefined,
            //     };
            //   }
            //   // expirationTime 不同步到 url
            //   return {
            //     ...values,
            //     expirationTime: undefined,
            //   };
            // }}
            initialValues={{
              id: null,
              name: '',
              pid: 0,
              code: '',
              simpleName: '',
              tel: '',
              orgType: null,
              manager: '',
              phone: '',
              remark: '',
            }}
            autoFocusFirstInput
          >
            <ProFormRadio.Group
              colProps={{ span: 12 }}
              label={intl.formatMessage({
                id: 'layout.organization.bizUnit.orgType.title',
              })}
              name="orgType"
              tooltip={
                <FormattedMessage id="layout.organization.bizUnit.orgType.tooltip" />
              }
              rules={[
                {
                  required: true,
                },
              ]}
              readonly={formStatus === FormStatus.EDIT_NODE}
              options={[
                {
                  label: (
                    <FormattedMessage id="layout.organization.bizUnit.orgType.headquarter" />
                  ),
                  value: 1,
                  disabled: formStatus === FormStatus.CREAT_CHILD,
                },
                {
                  label: (
                    <FormattedMessage id="layout.organization.bizUnit.orgType.branch" />
                  ),
                  value: 2,
                  disabled: formStatus === FormStatus.CREAT_ROOT,
                },
                {
                  label: (
                    <FormattedMessage id="layout.organization.bizUnit.orgType.external" />
                  ),
                  value: 3,
                  disabled: formStatus === FormStatus.CREAT_ROOT,
                },
              ]}
            />
            <ProFormText
              colProps={{ span: 12 }}
              width="md"
              name="pName"
              readonly={true}
              label={
                <FormattedMessage id="layout.organization.bizUnit.parent" />
              }
            />
            <ProFormText
              colProps={{ span: 12 }}
              width="md"
              name="code"
              readonly={formStatus === FormStatus.EDIT_NODE}
              label={intl.formatMessage({
                id: 'layout.organization.bizUnit.code',
              })}
              rules={[{ required: true }]}
            />
            <ProFormText
              colProps={{ span: 12 }}
              width="md"
              name="name"
              label={intl.formatMessage({
                id: 'layout.organization.bizUnit.name',
              })}
              rules={[{ required: true }]}
            />
            <ProFormText
              colProps={{ span: 12 }}
              width="md"
              name="simpleName"
              label={
                <FormattedMessage id="layout.organization.bizUnit.shortName" />
              }
            />
            <ProFormText
              colProps={{ span: 12 }}
              width="md"
              name="tel"
              label={<FormattedMessage id="layout.organization.bizUnit.tel" />}
            />
            <ProFormText
              colProps={{ span: 12 }}
              width="md"
              name="manager"
              label={
                <FormattedMessage id="layout.organization.bizUnit.manager" />
              }
            />
            <ProFormText
              colProps={{ span: 12 }}
              width="md"
              name="phone"
              label={
                <FormattedMessage id="layout.organization.bizUnit.phone" />
              }
            />
            <ProFormTextArea
              width="xl"
              label={
                <FormattedMessage id="layout.organization.bizUnit.remark" />
              }
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
              <FormattedMessage id="layout.organization.bizUnit.createRoot" />
            </Button>
          </Empty>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default BizUnitList;
