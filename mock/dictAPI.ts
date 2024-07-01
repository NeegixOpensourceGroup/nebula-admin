let dictGroup = [
  {id:1, name: '字典分类2'},
  {id:2, name: '字典分类3'}
]

export default {
  'GET /api/v1/dictList': (req: any, res: any) => {
    const { current = 1, pageSize = 10, name } = req.query;
    res.json({
      data: { 
        total: dictGroup.length,
        pageSize: 10,
        current: 1,
        list: dictGroup.filter(item=>{
          if(name === undefined){
            return true
          }
          const isFilter =  item.name.includes(name)
          return isFilter
        }).splice((current-1)*pageSize, pageSize)
      },
      code: 200,
      message: '查询成功'
    })
  },
  'PUT /api/v1/dict': (req: any, res: any) => {
    dictGroup = dictGroup.map(item => (item.id === req.body.id ? req.body : item))
    console.log(dictGroup)
    res.json({
      code: 200,
      message: '更新成功'
    });
  },
  'POST /api/v1/dict': (req: any, res: any) => {
    dictGroup.push({...req.body, id: dictGroup.length+1})
    res.json({
      code: 200,
      message: '新增成功'
    });
  },
  'DELETE /api/v1/dict/1': (req: any, res: any) => {
    dictGroup = dictGroup.filter(item => item.id !==1)
    res.json({
      code: 200,
      message: '删除成功'
    });
  },
}