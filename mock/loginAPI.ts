

export default {
  'POST /api/v1/login': (req: any, res: any) => {
    res.setHeader('Authorization', 'Bearer 12030123919231823818238123')
    res.json({
      code: 200,
      message: '登录成功'
    })
  },
  'POST /api/v1/logout': (req: any, res: any) => {
    res.json({
      code: 200,
      message: '退出成功'
    })
  },
}