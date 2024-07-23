const access = {
  'system:psn:list': true,
  'system:psn:add': true,
  'system:psn:edit': true,
  'system:psn:delete': true,
  'system:psn:export': true,
  'system:psn:import': true,
  'system:psn:query': true,
  'system:psn:resetPwd': true,
  'system:psn:changeStatus': true,
};

export default {
  'GET /api/v1/access': (req: any, res: any) => {
    res.json({
      code: 200,
      data: access,
      message: '查询成功'
    })
  }
}