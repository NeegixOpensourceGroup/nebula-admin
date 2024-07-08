import { TreeDataNode } from "antd";
interface Config {
  idKey: string;
  nameKey: string;
  pidKey: string;
  rootPidValue?: any;
}

export function buildTreeData(
  items: [],
  config: Config = { // 给 config 参数一个默认值
    idKey: 'id', // 假设默认的 id 键是 'id'
    nameKey: 'name', // 假设默认的 name 键是 'name'
    pidKey: 'pid', // 假设默认的 pid 键是 'pid'
    rootPidValue: 0 // 假设默认的根节点 pid 值是 0
  } // 注意：默认值必须符合 Config<T> 接口的结构
): TreeDataNode[] {
  const { idKey, nameKey, pidKey, rootPidValue = 0 } = config;
  const map: { [key: string]: TreeDataNode } = {};

  // Initialize all nodes and store them in a map
  items.forEach(item => {
    const id = item[idKey] as string | number;
    const name = item[nameKey] as string;
    map[String(id)] = {
      key: id,
      title: name
    };
  });

  // Build the tree structure
  const treeData: TreeDataNode[] = [];
  items.forEach(item => {
    const id = item[idKey] as string | number;
    const pid = item[pidKey] as string | number;
    const parentId = pid !== undefined && pid !== null ? (pid as string | number) : rootPidValue;

    if (String(parentId) === String(rootPidValue)) {
      treeData.push(map[String(id)]);
    } else if (parentId !== null && map[String(parentId)]) {
      const parent = map[String(parentId)];
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(map[String(id)]);
    }
  });

  // Remove empty children arrays
  const removeEmptyChildren = (nodes: TreeDataNode[]) => {
    nodes.forEach(node => {
      if (node.children && node.children.length === 0) {
        delete node.children;
      } else if (node.children) {
        removeEmptyChildren(node.children);
      }
    });
  };

  removeEmptyChildren(treeData);

  return treeData;
}

// 定义辅助函数，用于获取当前节点的父节点
export function getParentNode(nodeKey: string | number, treeData: TreeDataNode[]): TreeDataNode | null {
  // 辅助函数，用于递归查找父节点
  function findParent(node: TreeDataNode, key: string | number): TreeDataNode | null {
    // 如果节点的 key 与给定的 key 匹配，则返回该节点本身，因为它是根节点
    if (node.key === key) {
      return null;
    }
    // 遍历当前节点的所有子节点
    for (const child of node.children || []) {
      // 如果子节点是数组，则递归查找
      if (Array.isArray(child)) {
        const result = findParent(child[0], key);
        if (result) return result;
      } else if (child.key === key) {
        // 如果找到匹配的子节点，返回当前节点作为父节点
        return node;
      } else {
        // 否则，递归查找子节点的子节点
        const result = findParent(child, key);
        if (result) return result;
      }
    }
    // 如果当前节点的所有子节点都不匹配，返回 null
    return null;
  }

  // 从树数据的第一层开始递归查找
  for (const rootNode of treeData) {
    const parentNode = findParent(rootNode, nodeKey);
    if (parentNode) return parentNode;
  }
  return null;
}