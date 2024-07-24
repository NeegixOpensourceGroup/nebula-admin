let users = [
  { id: 1,bizUnitPk: 1, code:'100001', name: '马云', nickname: '老马', gender: 3,
    birthday: '1971-01-01', cardKind: 4, card: '111111111111111111',
    workDate: '2010-01-01', homeAddress: '北京市朝阳区芍药居', homeTel: '010-1234567',
    workTel: '010-1234567', phone: '13888888888', email: 'xxxx@qq.com', status: true,
    dataSource:[{
      id: 0, bizUnitPk: 1, code: '000001', kind: '部门', dept:1, major: false, duty: '总经理', position: '总经理', start: '2020-01-01', end: '2020-01-01',
    },{
      id: 1, bizUnitPk: 1, code: '000002', kind: '部门', dept:2, major: false, duty: '总经理', position: '总经理', start: '2020-01-01', end: '2020-01-01',
    }
    ]
   },
  { id: 2,bizUnitPk: 1, code:'100002', name: '马化腾', nickname: '小马', gender: 1,
    birthday: '1971-01-01', cardKind: 5, card: '111111111111111111',
    workDate: '2010-01-01', homeAddress: '北京市朝阳区芍药居', homeTel: '010-1234567',
    workTel: '010-1234567', phone: '13888888888', email: 'xxxx@qq.com', status: true,
    dataSource:[{
      id: 0, bizUnitPk: 1, code: '000001', kind: '部门', dept:3, major: false, duty: '总经理', position: '总经理',
    }]
   },
];

export default {
  'GET /api/v1/psn': (req: any, res: any) => {
    const { current, pageSize, code, name, nickname, gender, bizUnitId, checkedKey } = req.query;
    let psns = users.filter(item => {
      if (bizUnitId && item.bizUnitPk !== parseInt(bizUnitId)) {
        return false;
      }
      if (code && item.code !== code) {
        return false;
      }
      if (name && item.name !== name) {
        return false;
      }
      if (nickname && item.nickname !== nickname) {
        return false;
      }
      if (gender && item.gender !== parseInt(gender)) {
        return false;
      }
      if (checkedKey && !item.dataSource.find(item => item.dept === parseInt(checkedKey))) {
        return false;
      }
      return true;
    })
    // 分页查询
    psns = psns.splice(pageSize * (current - 1), pageSize);
    res.json({
      success: true,
      data: { list: psns },
      errorCode: 0,
    });
  },
  'PUT /api/v1/psn/:id': (req: any, res: any) => {
    users = users.map(item => (item.id === parseInt(req.params.id) ? {id:parseInt(req.params.id),...req.body} : item))
    res.json({
      code: 200,
      message: '保存成功'
    });
  },
  'POST /api/v1/psn': (req: any, res: any) => {
    users.push({
      id: users.length+1,
      ...req.body,
    });
    res.json({
      code: 200,
      message: '保存成功'
    });
  },
  'DELETE /api/v1/psn/:id': (req: any, res: any) => {
    const { id } = req.params;
    id.split(',').forEach((item:any) => {
      users.splice(
        users.findIndex((user) => user.id === parseInt(item)),
        1,
      );
    })

    res.json({
      code: 200,
      message: '删除成功'
    });
  },
  'GET /api/v1/psn/:id': (req: any, res: any) => {
    const { id } = req.params;
    res.json({
      data: users.find((item) => item.id === parseInt(id)),
      code: 200,
      message: '查询成功'
    });
  },
};
