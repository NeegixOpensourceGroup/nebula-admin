const users = [
  { id: 0, code:'100001', name: '马云', nickName: '老马', gender: '男' },
  { id: 1, code:'100002', name: '马化腾', nickName: '小马', gender: '男' },
];

export default {
  'GET /api/v1/queryUserList': (req: any, res: any) => {
    res.json({
      success: true,
      data: { list: users },
      errorCode: 0,
    });
  },
  'PUT /api/v1/user/': (req: any, res: any) => {
    res.json({
      success: true,
      errorCode: 0,
    });
  },
  'POST /api/v1/user': (req: any, res: any) => {
    users.push({
      id: users.length,
      ...req.body,
    });
    res.json({
      success: true,
      errorCode: 0,
    });
  },
};
