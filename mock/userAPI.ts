let users = [
  {
    id: 1,
    name: 'admin',
    description: '管理员',
    email: 'admin@nebula.com',
    phone: '12345678901',
    password: '123456',
    enabled: true,
    createTime: '2021-01-01 00:00:00',
    remark: '管理员',
  },
  {
    id: 2,
    name: 'user',
    description: '用户',
    email: 'user@nebula.com',
    mobilePhone: '12345678902',
    password: '123456',
    enabled: true,
    createTime: '2021-01-01 00:00:00',
    remark: '用户',
  },
  {
    id: 3,
    name: 'guest',
    description: '游客',
    email: 'guest@nebula.com',
    mobilePhone: '12345678903',
    password: '123456',
    enabled: true,
    createTime: '2021-01-01 00:00:00',
    remark: '游客',
  },
  {
    id: 4,
    name: 'disabled',
    description: '禁用用户',
    email: 'disabled@nebula.com',
    mobilePhone: '12345678904',
    password: '123456',
    enabled: false,
    createTime: '2021-01-01 00:00:00',
    remark: '禁用用户',
  },
  {
    id: 5,
    name: 'deleted',
    description: '删除用户',
    email: 'deleted@nebula.com',
    mobilePhone: '12345678905',
    password: '123456',
    enabled: true,
    createTime: '2021-01-01 00:00:00',
    remark: '删除用户',
  },
];

export default {
  'GET /api/v1/user': (req: any, res: any) => {
    const { current = 1, pageSize = 10 } = req.query;
    res.send({
      code: 200,
      message: 'success',
      data: {
        total: users.length,
        pageSize,
        current,
        result: [...users].reverse().splice((current - 1) * pageSize, pageSize),
      },
    });
  },
  'POST /api/v1/user': (req: any, res: any) => {
    users.push({ ...req.body, id: users.length + 1 });
    res.send({
      code: 200,
      message: '创建成功',
    });
  },
  'PUT /api/v1/user/:id': (req: any, res: any) => {
    users = users.map((item) => {
      if (item.id === parseInt(req.params.id)) {
        return { ...item, ...req.body };
      }
      return item;
    });
    res.send({
      code: 200,
      message: '更新成功',
    });
  },
  'DELETE /api/v1/user/:id': (req: any, res: any) => {
    const { id } = req.params;
    id.split(',').forEach((item: any) => {
      users.splice(
        users.findIndex((user) => user.id === parseInt(item)),
        1,
      );
    });
    res.send({
      code: 200,
      message: '删除成功',
    });
  },
  'GET /api/v1/user/:id': (req: any, res: any) => {
    const user = users.find((item) => item.id === parseInt(req.params.id));
    if (user) {
      res.send({
        code: 200,
        data: {
          ...user,
        },
      });
    } else {
      // 如果没有找到用户，发送错误响应
      res.status(404).send({
        code: 404,
        message: '未找到对应的用户',
      });
    }
  },
};
