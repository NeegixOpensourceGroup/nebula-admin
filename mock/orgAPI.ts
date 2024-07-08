let orgs = [
  {id:1, name: '赚钱集团总部', code:'10',orgType: 1, pid: 0},
  {id:2, name: '赚钱集团-常州分公司', code:'1001',orgType: 2, pid: 1},
  {id:3, name: '财务部', code:'100101',orgType: 3, pid: 2},
  {id:4, name: '赚钱集团-无锡分公司', code:'',orgType: 2, pid: 1}
]

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
    orgs.push({...req.body, id: orgs.length+1})
    res.json({
      code: 200,
      message: '新增成功'
    });
  },
  'PUT /api/v1/org/:id': (req: any, res: any) => {
    orgs = orgs.map(item => (item.id === parseInt(req.params.id) ? req.body : item))
    res.json({
      code: 200,
      message: '更新成功'
    });
  },
}