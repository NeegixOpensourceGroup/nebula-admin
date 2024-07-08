let orgs = [
  {id:1, name: '赚钱集团总部', code:'10',orgType: 1, pid: 0},
  {id:2, name: '赚钱集团-常州分公司', code:'1001',orgType: 2, pid: 1},
  {id:3, name: '财务部', code:'100101',orgType: 3, pid: 2},
  {id:4, name: '赚钱集团-无锡分公司', code:'',orgType: 2, pid: 1}
]
function deleteOrgAndChildren(orgs:any[], id:any) {
  // 首先找到要删除的节点
  const orgToDelete = orgs.find(org => org.id === id);
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
  const childrenToDelete = orgs.filter(org => org.pid === id);
  childrenToDelete.forEach(child => {
    deleteOrgAndChildren(orgs, child.id);
  });
}
export default {
  'GET /api/v1/org': (req: any, res: any) => {
    res.json({
      data: orgs,
      code: 200,
      message: '查询成功'
    })
  },
  'GET /api/v1/org/:id': (req: any, res: any) => {
    const { id } = req.params
    const [org] = orgs.filter(item => item.id === parseInt(id))
    res.json({
      data: org,
      code: 200,
      message: '查询成功'
    })
  },
  'POST /api/v1/org': (req: any, res: any) => {
    const insertId = orgs.length+1;
    orgs.push({...req.body, id: insertId})
    res.json({
      code: 200,
      message: '新增成功',
      data: {
        id: insertId
      }
    });
  },
  'PUT /api/v1/org/:id': (req: any, res: any) => {
    orgs = orgs.map(item => (item.id === parseInt(req.params.id) ? {id:parseInt(req.params.id),...req.body} : item))
    console.log(orgs)
    res.json({
      code: 200,
      message: '更新成功'
    });
  },
  'DELETE /api/v1/org/:id': (req: any, res: any) => {
    const id = parseInt(req.params.id);
    deleteOrgAndChildren(orgs, id);
    res.json({
      code: 200,
      message: '删除成功'
    });
  },

}