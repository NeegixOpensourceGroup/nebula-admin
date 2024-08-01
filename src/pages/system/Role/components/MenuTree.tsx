import React, { useEffect, useMemo, useState } from 'react';
import { Tree, Input } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';
import menuServices from '@/services/development/menu';
import styles from './index.less';
import { buildTreeData } from '@/utils/tools';
const { Search } = Input;
const { queryMenuList } = menuServices.MenuController;


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

interface MenuTreeProps {
  onCheck?: (checkedKeys: React.Key[], halfCheckedKeys: React.Key[]) => void;
  checkedKeys?: React.Key[];
}

const MenuTree: React.FC<MenuTreeProps> = ({ onCheck, checkedKeys:defaultCheckedKeys }) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState('');
  const [defaultTreeData, setDefaultTreeData] = useState<TreeDataNode[]>([]);
  console.log("defaultCheckedKeys", defaultCheckedKeys)
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

  useEffect(() => {
    queryMenuList().then((res) => {
      const treeData = buildTreeData(res.data, {
        idKey: 'id',
        nameKey: 'name',
        pidKey: 'pid'
      })
      setDefaultTreeData(treeData)
      generateList(treeData);
      if(defaultCheckedKeys) {
        setCheckedKeys(defaultCheckedKeys)
        setExpandedKeys(defaultCheckedKeys)
      }
    });
    
  }, [defaultCheckedKeys]);

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

  const onExpand: TreeProps['onExpand'] = (expandedKeysValue) => {
    console.log('onExpand', expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onInnerCheck: TreeProps['onCheck'] = (checkedKeysValue, {halfCheckedKeys}) => {
    // setCheckedKeys(checkedKeysValue as React.Key[]);
    if (onCheck) {
      onCheck(checkedKeysValue as React.Key[], halfCheckedKeys as React.Key[]);
    }
    setCheckedKeys(checkedKeysValue as React.Key[]);
  };

  const onSelect: TreeProps['onSelect'] = (selectedKeysValue, info) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };

  return (
    <>
      <Search style={{ marginBottom: 8 }} placeholder="查询" onChange={onChange} />
      <Tree
        checkable
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={onInnerCheck}
        checkedKeys={checkedKeys}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
        treeData={treeData}
      />
    </>

  );
};

export default MenuTree;