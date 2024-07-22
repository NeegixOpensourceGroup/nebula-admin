interface Config {
  idKey: string;
  nameKey: string;
  pidKey: string;
}

export function buildTreeData(
  items: any[],
  config: Config = {
    idKey: 'id',
    nameKey: 'name',
    pidKey: 'pid'
  }
): any[] {
  const { idKey, nameKey, pidKey } = config;
  const map: { [key: string]: any } = {};

  if (!items || items.length === 0) return [];

  // Initialize all nodes and store them in a map
  items.forEach(item => {
    const id = item[idKey];
    const name = item[nameKey];
    map[String(id)] = {
      key: id,
      title: name,
      value: id,
      label: name,
      children: []
    };
  });

  // Declare treeData here
  const treeData: any[] = [];

  // Build the tree structure
  items.forEach(item => {
    const id = item[idKey];
    const pid = item[pidKey];

    // If pid doesn't exist in map or is null/undefined, it's a root node
    if (pid === null || !map.hasOwnProperty(String(pid))) {
      treeData.push(map[String(id)]);
    } else {
      const parent = map[String(pid)];
      parent.children.push(map[String(id)]);
    }
  });

  // Remove empty children arrays recursively
  const pruneEmptyChildren = (nodeList: any[]) => {
    nodeList.forEach(node => {
      if (node.children && node.children.length > 0) {
        pruneEmptyChildren(node.children);
        if (node.children.length === 0) {
          delete node.children;
        }
      }
    });
  };

  pruneEmptyChildren(treeData);

  return treeData;
}

// 定义辅助函数，用于获取当前节点的父节点
export function getParentNode(nodeKey: string | number, treeData: any[]): any | null {
  // 辅助函数，用于递归查找父节点
  function findParent(node: any, key: string | number): any | null {
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