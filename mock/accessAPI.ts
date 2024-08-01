const access = {
  'organization:psn:list': true,
  'organization:psn:add': true,
  'organization:psn:edit': true,
  'organization:psn:delete': true,
  'organization:psn:export': true,
  'organization:psn:import': true,
  'organization:psn:query': true,
  'organization:psn:resetPwd': true,
  'organization:psn:changeStatus': true,
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