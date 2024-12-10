let depts = [
  { id: 1, name: '生产部', code: '10', pid: 0, bizUnitId: 1 },
  { id: 2, name: '财务部', code: '1001', pid: 0, bizUnitId: 1 },
  { id: 3, name: '采购部', code: '100101', pid: 0, bizUnitId: 1 },
  { id: 4, name: '设计部', code: '10002', pid: 0, bizUnitId: 1 },
  { id: 5, name: '仓库', code: '10001', pid: 0, bizUnitId: 1 },
];
function deleteOrgAndChildren(orgs: any[], id: any) {
  // 首先找到要删除的节点
  const orgToDelete = orgs.find((org) => org.id === id);
  if (!orgToDelete) {
    console.error('组织不存在');
    return;
  }

  // 从数组中删除该节点
  const index = orgs.indexOf(orgToDelete);
  if (index > -1) {
    orgs.splice(index, 1);
  }

  // 递归删除所有子节点
  const childrenToDelete = orgs.filter((org) => org.pid === id);
  childrenToDelete.forEach((child) => {
    deleteOrgAndChildren(orgs, child.id);
  });
}
export default {
  'GET /api/v1/dept/bizUnit/:bizUnitId': (req: any, res: any) => {
    const filterDepts = depts.filter(
      (item) => item.bizUnitId === parseInt(req.params.bizUnitId),
    );
    res.json({
      data: filterDepts,
      code: 200,
      message: '查询成功',
    });
  },
  'GET /api/v1/dept/:id': (req: any, res: any) => {
    const { id } = req.params;
    const [org] = depts.filter((item) => item.id === parseInt(id));
    res.json({
      data: org,
      code: 200,
      message: '查询成功',
    });
  },
  'POST /api/v1/dept/bizUnit/:bizUnitId': (req: any, res: any) => {
    const insertId = depts.length + 1;
    depts.push({
      ...req.body,
      id: insertId,
      bizUnitId: parseInt(req.params.bizUnitId),
    });
    res.json({
      code: 200,
      message: '新增成功',
      data: {
        id: insertId,
      },
    });
  },
  'PUT /api/v1/dept/:id': (req: any, res: any) => {
    depts = depts.map((item) =>
      item.id === parseInt(req.params.id)
        ? { id: parseInt(req.params.id), ...req.body }
        : item,
    );
    res.json({
      code: 200,
      message: '更新成功',
    });
  },
  'DELETE /api/v1/dept': (req: any, res: any) => {
    const id = parseInt(req.params.id);
    deleteOrgAndChildren(depts, id);
    res.json({
      code: 200,
      message: '删除成功',
    });
  },
  'GET /api/v1/dept/bizUnitId/:bizUnitId': (req: any, res: any) => {
    depts = depts.filter(
      (item) => item.bizUnitId === parseInt(req.params.bizUnitId),
    );
    res.json({
      data: depts,
      code: 200,
      message: '查询成功',
    });
  },
};
