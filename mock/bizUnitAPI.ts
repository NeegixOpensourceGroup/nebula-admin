let bizUnits = [
  {id:1, name: '赚钱集团总部', code:'10',orgType: 1, pid: 0},
  {id:2, name: '赚钱集团-常州分公司', code:'1001',orgType: 2, pid: 1},
  {id:3, name: '赚钱集团-无锡分公司', code:'',orgType: 2, pid: 1}
]
function deleteBizUnitAndChildren(bizUnits:any[], id:any) {
  // 首先找到要删除的节点
  const orgToDelete = bizUnits.find(bizUnit => bizUnit.id === id);
  if (!orgToDelete) {
    console.error('组织不存在');
    return;
  }

  // 从数组中删除该节点
  const index = bizUnits.indexOf(orgToDelete);
  if (index > -1) {
    bizUnits.splice(index, 1);
  }

  // 递归删除所有子节点
  const childrenToDelete = bizUnits.filter(bizUnit => bizUnit.pid === id);
  childrenToDelete.forEach(child => {
    deleteBizUnitAndChildren(bizUnits, child.id);
  });
}
export default {
  'GET /api/v1/bizUnit': (req: any, res: any) => {
    res.json({
      data: bizUnits,
      code: 200,
      message: '查询成功'
    })
  },
  'GET /api/v1/bizUnit/:id': (req: any, res: any) => {
    const { id } = req.params
    const [org] = bizUnits.filter(item => item.id === parseInt(id))
    res.json({
      data: org,
      code: 200,
      message: '查询成功'
    })
  },
  'POST /api/v1/bizUnit': (req: any, res: any) => {
    const insertId = bizUnits.length+1;
    bizUnits.push({...req.body, id: insertId})
    console.log(bizUnits)
    res.json({
      code: 200,
      message: '新增成功',
      data: {
        id: insertId
      }
    });
  },
  'PUT /api/v1/bizUnit/:id': (req: any, res: any) => {
    bizUnits = bizUnits.map(item => (item.id === parseInt(req.params.id) ? {id:parseInt(req.params.id),...req.body} : item))
    res.json({
      code: 200,
      message: '更新成功'
    });
  },
  'DELETE /api/v1/bizUnit/:id': (req: any, res: any) => {
    const id = parseInt(req.params.id);
    deleteBizUnitAndChildren(bizUnits, id);
    res.json({
      code: 200,
      message: '删除成功'
    });
  },
  'GET /api/v1/company': (req: any, res: any) => {
    const companies = bizUnits.filter(item => [1,2].includes(item.orgType))
    res.json({
      data: companies,
      code: 200,
      message: '查询成功'
    })
  }
}