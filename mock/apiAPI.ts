let api = [
  {
    id: 1,
    access: 'system:psn:query',
    name: 'third_psn',
    description: '第三方查询人员接口',
    module: 1,
    created_at: '2023-03-01 00:00:00',
  },
  {
    id: 2,
    access: 'system:psn:create',
    name: 'third_psn_create',
    description: '第三方创建人员接口',
    module: 1,
    created_at: '2023-03-01 00:00:00',
  },
];

export default {
  'DELETE /api/v1/api/:id': (req: any, res: any) => {
    const { id } = req.params;
    id.split(',').forEach((item: any) => {
      api.splice(
        api.findIndex((user) => user.id === parseInt(item)),
        1,
      );
    });

    res.json({
      code: 200,
    });
  },
  'GET /api/v1/api': (req: any, res: any) => {
    const { current = 1, pageSize = 10 } = req.query;
    res.json({
      code: 200,
      message: '查询成功',
      data: {
        total: api.length,
        pageSize,
        current,
        list: [...api].reverse().splice((current - 1) * pageSize, pageSize),
      },
    });
  },
  'GET /api/v1/api/:id': (req: any, res: any) => {
    const { id } = req.params;
    res.json({
      data: api.find((item) => item.id === parseInt(id)),
      code: 200,
    });
  },
  'POST /api/v1/api': (req: any, res: any) => {
    const { body } = req;
    api.push({ ...body, id: api.length + 1 });
    res.json({
      code: 200,
    });
  },
  'PUT /api/v1/api/:id': (req: any, res: any) => {
    const { body } = req;
    api = api.map((item) =>
      item.id === parseInt(req.params.id) ? body : item,
    );
    res.json({
      code: 200,
    });
  },
};
