let optLogs = [
  {
    id: 1,
    user: 'admin',
    optType: '新增',
    optDesc: '新增用户',
    optTime: '2023-01-01 00:00:00',
    optIp: '127.0.0.1',
  },
  {
    id: 2,
    user: 'admin',
    optType: '修改',
    optDesc: '修改用户',
    optTime: '2023-01-01 00:00:00',
    optIp: '127.0.0.1',
  },
  {
    id: 3,
    user: 'admin',
    optType: '删除',
    optDesc: '删除用户',
    optTime: '2023-01-01 00:00:00',
    optIp: '127.0.0.1',
  },
  {
    id: 4,
    user: 'admin',
    optType: '查询',
    optDesc: '查询用户',
    optTime: '2023-01-01 00:00:00',
    optIp: '127.0.0.1',
  },
  {
    id: 5,
    user: 'admin',
    optType: '新增',
    optDesc: '新增用户',
    optTime: '2023-01-01 00:00:00',
    optIp: '127.0.0.1',
  },
];

export default {
  'DELETE /api/v1/optLog/:id': (req: any, res: any) => {
    const { id } = req.params;
    optLogs = optLogs.filter((item: any) => item.id !== id);
    return res.send({
      code: 200,
      message: '删除成功',
      data: null,
    });
  },
  'GET /api/v1/optLog': (req: any, res: any) => {
    const { current = 1, pageSize = 10 } = req.query;
    return res.send({
      code: 200,
      message: '查询成功',
      data: {
        list: [...optLogs].reverse().splice((current - 1) * pageSize, pageSize),
        current,
        pageSize,
        total: optLogs.length,
      },
    });
  },
};
