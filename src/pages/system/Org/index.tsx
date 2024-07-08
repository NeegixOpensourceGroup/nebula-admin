import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormRadio,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Empty, Flex, Input, Space, Tree, message } from 'antd';
import type { TreeDataNode } from 'antd';
import styles from './index.less';
import  services  from '@/services/org';
import { buildTreeData, getParentNode } from '@/utils/tools';

const { queryOrgList, queryOrgById } = services.OrgController;
const { Search } = Input;


enum FormStatus {
  ROOT, // 根节点
  CREAT_ROOT,  // 创建根节点
  NO_DATA, // 暂无数据
  CREAT_CHILD, // 创建子节点
  EDIT_NODE,  // 编辑节点
  VIEW_NODE,  // 查看节点
}


// const x = 3;
// const y = 2;
// const z = 1;
// let defaultData: TreeDataNode[] = [];

// const generateData = (_level: number, _preKey?: React.Key, _tns?: TreeDataNode[]) => {
//   const preKey = _preKey || '0';
//   const tns = _tns || defaultData;

//   const children: React.Key[] = [];
//   for (let i = 0; i < x; i++) {
//     const key = `${preKey}-${i}`;
//     tns.push({ title: key, key });
//     if (i < y) {
//       children.push(key);
//     }
//   }
//   if (_level < 0) {
//     return tns;
//   }
//   const level = _level - 1;
//   children.forEach((key, index) => {
//     console.log(key)
//     tns[index].children = [];
//     return generateData(level, key, tns[index].children);
//   });
// };
// generateData(z);

const dataList: { key: React.Key; title: string }[] = [];
const generateList = (data: TreeDataNode[]) => {
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

const _setFormFieldValues = (data: any, checkedKey: number, formRef: any, defaultData: TreeDataNode[])=>{
  const parentNode = getParentNode(Number(checkedKey), defaultData);
      if (parentNode) {
        formRef?.current?.setFieldsValue({
          ...data,
          pName: parentNode.title // 安全地访问 title 属性
        });
      } else {
        formRef?.current?.setFieldsValue({
          ...data,
          pName: '总部' // parentNode 为 null 或 undefined 时的默认值
        });
      }
}
const TableList: React.FC<unknown> = () => {
  /// 左侧树-START
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [defaultData, setDefaultData] = useState<TreeDataNode[]>([]);
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
  const [checkedKey, setCheckedKey] = useState<number>();
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
          return getParentKey(item.key, defaultData);
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
      if(defaultData.length === 0){
        return []
      }
      const data = loop(defaultData);
    return data;
  }, [searchValue, defaultData]);
  /// 左侧树-END


  /// 表单-START
  useEffect(() => {
    const queryOrgs = async ()=>{
        const res = await queryOrgList();
        const treeData = buildTreeData(res.data, {
          idKey: 'id',
          nameKey: 'name',
          pidKey: 'pid'
        })

        setDefaultData(treeData)
        generateList(treeData);
        setFormStatus(treeData.length>0?FormStatus.NO_DATA:FormStatus.ROOT);
    }
    queryOrgs()
  }, []);

  // 编辑 界面
  const openEditHandler = ()=>{
    setFormStatus(FormStatus.EDIT_NODE)
  }

  // 新增 子节点界面
  const openAddSubHandler = ()=>{
    formRef?.current?.resetFields();
    setFormStatus(FormStatus.CREAT_CHILD)
  }

  // 新增 根节点子界面
  const openAddRootHandler = ()=>{
    formRef?.current?.setFieldsValue({orgType:1})
    setFormStatus(FormStatus.CREAT_ROOT)
  }

  //
  const cancleHandler = async ()=>{
    if(checkedKey !== undefined){
      const res = await queryOrgById(checkedKey);
      if (res.code === 200) {
        setFormStatus(FormStatus.VIEW_NODE)
        _setFormFieldValues(res.data, checkedKey, formRef, defaultData)
      } else {
        setFormStatus(FormStatus.NO_DATA)
      }
    } else {
      formRef?.current?.resetFields();
    }
    setFormStatus(treeData.length>0?FormStatus.VIEW_NODE:FormStatus.ROOT)
  }


  
  /// 表单-END


  return (
    <PageContainer
      header={{
        title: '组织管理',
      }}
    >
      <ProCard split="vertical">
        <ProCard title="组织" colSpan="20%">
        <Search style={{ marginBottom: 8 }} placeholder="查询" onChange={onChange} />
        <Tree
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onSelect={async ( selectedKeys) => {
              if (selectedKeys.length > 0) {
                const res = await queryOrgById(Number(selectedKeys[0]));
                if (res.code === 200) {
                  setFormStatus(FormStatus.VIEW_NODE)
                  setCheckedKey(Number(selectedKeys[0]))
                  _setFormFieldValues(res.data, Number(selectedKeys[0]), formRef, defaultData)
                } else {
                  setFormStatus(FormStatus.NO_DATA)
                }
              } else {
                  setFormStatus(FormStatus.NO_DATA)
              }
              
            }
          }
          treeData={treeData}
        />
        </ProCard>
        <ProCard title={`组织信息${formStatus===FormStatus.VIEW_NODE?'-查看':formStatus===FormStatus.EDIT_NODE?'-编辑':formStatus===FormStatus.CREAT_CHILD?'-新增子级':formStatus===FormStatus.CREAT_ROOT?'-新增根级':''}`} headerBordered
          style={{ minHeight: '500px' }}
          extra={
            <Space>
            {
              formStatus === FormStatus.VIEW_NODE?
              <>
                <Button onClick={openEditHandler}>编辑</Button>
                <Button type='primary' onClick={openAddSubHandler}>新增子级</Button>
                <Button danger type='primary'>删除</Button>
              </>:null
            }
            {
              formStatus === FormStatus.CREAT_ROOT || formStatus === FormStatus.CREAT_CHILD || formStatus === FormStatus.EDIT_NODE ? (
                <Button danger onClick={cancleHandler}>取消</Button>
              ) : null
            }
              
            </Space>
          }
          >
       
              <ProForm
                hidden={formStatus === FormStatus.ROOT || formStatus === FormStatus.NO_DATA}
                formRef={formRef}
                grid={true}
                readonly={formStatus === FormStatus.CREAT_ROOT || formStatus === FormStatus.CREAT_CHILD || formStatus === FormStatus.EDIT_NODE?false:true}
                onFinish={async () => {
                  message.success('提交成功');
                }}
                submitter={{
                  render: (props, doms) => {
                    return formStatus !== FormStatus.VIEW_NODE?
                      <Flex justify="flex-end" align="center">
                        <Space>{doms}</Space>
                      </Flex> :null;
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
                  simpleName:''
                }}
                autoFocusFirstInput
              >
              <ProFormRadio.Group
                colProps={{ span: 12 }}
                label="组织类型"
                name="orgType"
                readonly={formStatus === FormStatus.EDIT_NODE}
                options={[
                  {
                    label: '总部',
                    value: 1,
                    disabled: formStatus === FormStatus.CREAT_CHILD,
                  },
                  {
                    label: '子公司',
                    value: 2,
                    disabled: formStatus === FormStatus.CREAT_ROOT,
                  },
                  {
                    label: '部门',
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
                label="上级组织名称"
              />
              <ProFormText
                colProps={{ span: 12 }}
                width="md"
                name="code"
                readonly={formStatus === FormStatus.EDIT_NODE}
                label="组织代码"
                placeholder="请输入组织代码"
              />
              <ProFormText
                colProps={{ span: 12 }}
                width="md"
                name="name"
                label="组织名称"
                placeholder="请输入组织名称"
              />
              <ProFormText
                colProps={{ span: 12 }}
                width="md"
                name="simpleName"
                label="组织简称"
                placeholder="请输入组织简称"
              />
              <ProFormText
                colProps={{ span: 12 }}
                width="md"
                name="tel"
                label="联系电话"
                placeholder="请输入联系电话"
              />
              <ProFormText
                colProps={{ span: 12 }}
                width="md"
                name="manager"
                label="负责人"
                rules={[{ required: true }]}
                placeholder="请输入负责人"
              />
              <ProFormText
                colProps={{ span: 12 }}
                width="md"
                name="phone"
                label="负责人电话"
                placeholder="请输入负责人电话"
              />
              <ProFormTextArea width="xl" label="备注" name="remark" />
            </ProForm>
            <Empty
              style={{ display: formStatus === FormStatus.NO_DATA|| formStatus === FormStatus.ROOT ? 'block' : 'none' }}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
              <Button hidden={formStatus!==FormStatus.ROOT} type="primary" onClick={openAddRootHandler}>创建组织总部</Button>
            </Empty>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default TableList;
