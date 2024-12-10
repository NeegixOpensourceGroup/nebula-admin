let posts = [
  { id: 1, bizUnitId: 1, deptId: 1, name: '董事长', code: '10', enabled: true },
  {
    id: 2,
    bizUnitId: 1,
    deptId: 1,
    name: '总经理',
    code: '1001',
    enabled: true,
  },
  {
    id: 3,
    bizUnitId: 1,
    deptId: 1,
    name: '总经理助理',
    code: '',
    enabled: true,
  },
];

export default {
  'DELETE /api/v1/post': (req: any, res: any) => {
    const { id } = req.params;
    id.split(',').forEach((item: any) => {
      posts.splice(
        posts.findIndex((post) => post.id === parseInt(item)),
        1,
      );
    });
    res.send({
      code: 200,
      message: '删除成功',
    });
  },
  'GET /api/v1/post/:current/:pageSize': (req: any, res: any) => {
    const { current = 1, pageSize = 10, bizUnitId, checkedKey } = req.query;

    let filterPosts = posts.filter(
      (post) =>
        post.bizUnitId === parseInt(bizUnitId) &&
        post.deptId === parseInt(checkedKey),
    );

    res.send({
      code: 200,
      message: '查询成功',
      data: {
        total: filterPosts.length,
        current,
        pageSize,
        list: [...filterPosts].slice(
          (current - 1) * pageSize,
          current * pageSize,
        ),
      },
    });
  },
  'GET /api/v1/post/:id': (req: any, res: any) => {
    const { id } = req.params;
    const post = posts.find((post) => post.id === parseInt(id));
    res.send({
      code: 200,
      message: '查询成功',
      data: post,
    });
  },
  'POST /api/v1/post': (req: any, res: any) => {
    posts.push({ ...req.body, id: posts.length + 1 });
    res.send({
      code: 200,
      message: '保存成功',
    });
  },
  'PUT /api/v1/post/:id': (req: any, res: any) => {
    const { id } = req.params;
    posts = posts.map((item) =>
      item.id === parseInt(id) ? { id: parseInt(id), ...req.body } : item,
    );
    res.send({
      code: 200,
      message: '保存成功',
    });
  },
};
