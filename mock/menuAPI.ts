let menus = [
  {id:1, name: '首页', access:'home', type: 1, pid: 0},
  {id:2, name: '系统管理', access:'system', type: 1, pid: 0},
  {id:3, name: '组织管理', access:'system:bizUnit', type: 1, pid: 2},
  {id:4, name: '部门管理', access:'system:dept',type: 1, pid: 2},
  {id:5, name: '人员管理', access:'system:psn',type: 1, pid: 2},
  {id:6, name: '字典管理', access:'system:dict',type: 1, pid: 2},
  {id:7, name: '角色管理', access:'system:role',type: 1, pid: 2},
  {id:8, name: '日志管理', type: 1, pid: 0}
]

function deleteMenuAndChildren(menus:any[], id:any) {
  // 首先找到要删除的节点
  const menuToDelete = menus.find(menu => menu.id === id);
  if (!menuToDelete) {
    console.error('菜单不存在');
    return;
  }

  // 从数组中删除该节点
  const index = menus.indexOf(menuToDelete);
  if (index > -1) {
    menus.splice(index, 1);
  }

  // 递归删除所有子节点
  const childrenToDelete = menus.filter(menu => menu.pid === id);
  childrenToDelete.forEach(child => {
    deleteMenuAndChildren(menus, child.id);
  });
}

export default {
  'GET /api/v1/menu': (req: any, res: any) => {
    res.json({
      data: menus,
      code: 200,
      message: '查询成功'
    })
  },
  'GET /api/v1/menu/:id': (req: any, res: any) => {
    const { id } = req.params
    const [menu]= menus.filter(item => item.id === parseInt(id))
    res.json({
      data: menu,
      code: 200,
      message: '查询成功'
    })
  },
  'POST /api/v1/menu': (req: any, res: any) => {
    const { body } = req
    menus.push({...body, id: menus.length + 1})
    res.json({
      code: 200,
      message: '新增成功'
    })
  },
  'DELETE /api/v1/menu/:id': (req: any, res: any) => {
    const { id } = req.params
    deleteMenuAndChildren(menus, parseInt(id));
    res.json({
      code: 200,
      message: '删除成功'
    })
  },
  'PUT /api/v1/menu/:id': (req: any, res: any) => {
    const { id } = req.params
    const { body } = req
    menus = menus.map(item => {
      if (item.id === parseInt(id)) {
        return {...item, ...body}
      }
      return item
    })
    res.json({
      code: 200,
      message: '更新成功'
    })
  }
}