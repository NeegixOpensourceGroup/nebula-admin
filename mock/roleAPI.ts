let roles = [
  {
    id: 1,
    name: 'admin',
    description: '管理员',
    enabled: true,
    createTime: '2023-01-01 00:00:00',
    pagePermissions: [
      {
        pkMenu: 1,
        isHalf: false,
      },
      {
        pkMenu: 4,
        isHalf: false,
      },
      {
        pkMenu: 5,
        isHalf: true,
      },
    ],
  },
  {
    id: 2,
    name: 'user',
    description: '用户',
    enabled: false,
    createTime: '2023-01-01 00:00:00',
  },
];

export default {
  // 支持值为 Object 和 Array
  'GET /api/v1/role': (req: any, res: any) => {
    const { current = 1, pageSize = 10 } = req.query;
    res.send({
      code: 200,
      data: {
        total: roles.length,
        pageSize,
        current,
        list: [...roles].reverse().splice((current - 1) * pageSize, pageSize),
      },
      success: true,
    });
  },
  'POST /api/v1/role': (req: any, res: any) => {
    roles.push({ ...req.body, id: roles.length + 1 });
    res.send({
      code: 200,
      message: '创建成功',
    });
  },
  'PUT /api/v1/role/:id': (req: any, res: any) => {
    roles = roles.map((item) => {
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
  'DELETE /api/v1/role/:id': (req: any, res: any) => {
    const { id } = req.params;
    id.split(',').forEach((item: any) => {
      roles.splice(
        roles.findIndex((role) => role.id === parseInt(item)),
        1,
      );
    });
    res.send({
      code: 200,
      message: '删除成功',
    });
  },
  'GET /api/v1/role/:id': (req: any, res: any) => {
    const role = roles.find((item) => item.id === parseInt(req.params.id));

    if (role) {
      // 筛选出 isHalf 为 false 的 pagePermissions
      const filteredPagePermissions = role.pagePermissions?.filter(
        (permission) => permission.isHalf === false,
      );

      // 发送筛选后的 pagePermissions 作为响应
      res.send({
        code: 200,
        data: {
          ...role,
          pagePermissions: filteredPagePermissions,
        },
      });
    } else {
      // 如果没有找到角色，发送错误响应
      res.status(404).send({
        code: 404,
        message: '未找到对应的角色',
      });
    }
  },
};
