let exceptionLogs = [
  {
    id: 1,
    user: '张三',
    ip: '192.168.1.1',
    level: 1,
    message: '错误信息1',
    stack: '错误堆栈1',
    error_module: '错误模块1',
  },
  {
    id: 2,
    user: '李四',
    ip: '192.168.1.2',
    level: 2,
    message: '错误信息2',
    stack: '错误堆栈2',
    error_module: '错误模块2',
  },
  {
    id: 3,
    user: '王五',
    ip: '192.168.1.3',
    level: 3,
    message: '错误信息3',
    stack: '错误堆栈3',
    error_module: '错误模块3',
  },
  {
    id: 4,
    user: '赵六',
    ip: '192.168.1.4',
    level: 4,
    message: '错误信息4',
    stack: '错误堆栈4',
    error_module: '错误模块4',
  },
  {
    id: 5,
    user: '钱七',
    ip: '192.168.1.5',
    level: 5,
    message: '错误信息5',
    stack: '错误堆栈5',
    error_module: '错误模块5',
  },
];

export default {
  'DELETE /api/v1/exceptionLog/:id': (req: any, res: any) => {
    const { id } = req.params;
    exceptionLogs = exceptionLogs.filter((item: any) => item.id !== id);
    return res.send({
      code: 200,
      message: '删除成功',
      data: null,
    });
  },
  'GET /api/v1/exceptionLog': (req: any, res: any) => {
    const { current = 1, pageSize = 10 } = req.query;
    return res.send({
      code: 200,
      message: '查询成功',
      data: {
        list: [...exceptionLogs]
          .reverse()
          .splice((current - 1) * pageSize, pageSize),
        current,
        pageSize,
        total: exceptionLogs.length,
      },
    });
  },
};
