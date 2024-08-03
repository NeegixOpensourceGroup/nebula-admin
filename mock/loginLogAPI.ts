let loginLogs = [
  {
    id: 1,
    user: 'admin',
    ip: '127.0.0.1',
    loginTime: '2023-01-01 00:00:00',
    loginLocation: '中国',
    loginStatus: '成功',
    loginMsg: '登录成功',
  },
  {
    id: 2,
    user: 'admin',
    ip: '127.0.0.1',
    loginTime: '2023-01-01 00:00:00',
    loginLocation: '中国',
    loginStatus: '成功',
    loginMsg: '登录成功',
  },
  {
    id: 3,
    user: 'admin',
    ip: '127.0.0.1',
    loginTime: '2023-01-01 00:00:00',
    loginLocation: '中国',
    loginStatus: '成功',
    loginMsg: '登录成功',
  },
  {
    id: 4,
    user: 'admin',
    ip: '127.0.0.1',
    loginTime: '2023-01-01 00:00:00',
    loginLocation: '中国',
    loginStatus: '成功',
    loginMsg: '登录成功',
  },
];

export default {
  'DELETE /api/v1/loginLog/:id': (req: any, res: any) => {
    const { id } = req.params;
    loginLogs = loginLogs.filter((item: any) => item.id !== id);
    return res.send({
      code: 200,
      message: '删除成功',
      data: null,
    });
  },
  'GET /api/v1/loginLog': (req: any, res: any) => {
    const { current = 1, pageSize = 10 } = req.query;
    return res.send({
      code: 200,
      message: '查询成功',
      data: {
        list: [...loginLogs]
          .reverse()
          .splice((current - 1) * pageSize, pageSize),
        current,
        pageSize,
        total: loginLogs.length,
      },
    });
  },
};
