let dictGroup = [
  { id: 1, name: '性别', code: 'GENDER' },
  { id: 2, name: '证件类型', code: 'CARD_KIND' },
];

let dictItem = [
  {
    id: 1,
    dictId: 1,
    name: '男',
    value: '1',
  },
  {
    id: 2,
    dictId: 1,
    name: '女',
    value: '2',
  },
  {
    id: 3,
    dictId: 1,
    name: '不男不女',
    value: '3',
  },
  {
    id: 4,
    dictId: 2,
    name: '身份证',
    value: '1',
  },
  {
    id: 5,
    dictId: 2,
    name: '驾照',
    value: '2',
  },
  {
    id: 6,
    dictId: 2,
    name: '护照',
    value: '3',
  },
  {
    id: 7,
    dictId: 2,
    name: '港澳居民来往内地通行证',
    value: '4',
  },
  {
    id: 8,
    dictId: 2,
    name: '台湾居民来往大陆通行证',
    value: '5',
  },
];

export default {
  'GET /api/v1/dictGroup': (req: any, res: any) => {
    const { current = 1, pageSize = 10, name } = req.query;

    const handlerDictGroup = dictGroup.filter((item) => {
      if (name === undefined) {
        return true;
      }
      const isFilter = item.name.includes(name);
      return isFilter;
    });

    res.json({
      data: {
        total: handlerDictGroup.length,
        pageSize: 10,
        current: current,
        result: handlerDictGroup
          .reverse()
          .splice((current - 1) * pageSize, pageSize),
      },
      code: 200,
      message: '查询成功',
    });
  },
  'PUT /api/v1/dict/:id': (req: any, res: any) => {
    dictGroup = dictGroup.map((item) =>
      item.id === parseInt(req.params.id) ? req.body : item,
    );
    res.json({
      code: 200,
      message: '更新成功',
    });
  },
  'POST /api/v1/dict': (req: any, res: any) => {
    dictGroup.push({ ...req.body, id: dictGroup.length + 1 });
    res.json({
      code: 200,
      message: '新增成功',
    });
  },
  'DELETE /api/v1/dict/:id': (req: any, res: any) => {
    dictGroup = dictGroup.filter((item) => item.id !== parseInt(req.params.id));
    res.json({
      code: 200,
      message: '删除成功',
    });
  },
  'GET /api/v1/dictItem/:dictId': (req: any, res: any) => {
    const { current = 1, pageSize = 10, name, value } = req.query;
    const list = dictItem
      .filter((item) => item.dictId === parseInt(req.params.dictId))
      .filter((item) => {
        if (name === undefined && value === undefined) {
          return true;
        }
        if (name === undefined) {
          return item.value.includes(value);
        }
        if (value === undefined) {
          return item.name.includes(name);
        }

        const isFilter = item.name.includes(name) && item.value.includes(value);
        return isFilter;
      });

    res.json({
      data: {
        total: list.length,
        pageSize: 10,
        current: current,
        list: list.reverse().splice((current - 1) * pageSize, pageSize),
      },
      code: 200,
      message: '查询成功',
    });
  },
  'PUT /api/v1/dictItem/:dictId/:id': (req: any, res: any) => {
    const { dictId, id } = req.params;
    dictItem = dictItem.map((item) =>
      item.id === parseInt(id) && item.dictId === parseInt(dictId)
        ? req.body
        : item,
    );
    res.json({
      code: 200,
      message: '更新成功',
    });
  },
  'POST /api/v1/dictItem/:dictId': (req: any, res: any) => {
    dictItem.push({ ...req.body, id: dictItem.length + 1 });
    res.json({
      code: 200,
      message: '新增成功',
    });
  },
  'DELETE /api/v1/dictItem/:dictId/:id': (req: any, res: any) => {
    const { dictId, id } = req.params;
    dictItem = dictItem.filter(
      (item) => !(item.id === parseInt(id) && item.dictId === parseInt(dictId)),
    );
    res.json({
      code: 200,
      message: '删除成功',
    });
  },
  'GET /api/v1/dictItem/dictCode/:dictCode': (req: any, res: any) => {
    const dictGroupData = dictGroup.find(
      (item) => item.code === req.params.dictCode,
    );
    if (dictGroupData) {
      const list = dictItem.filter((item) => item.dictId === dictGroupData.id);
      res.json({
        code: 200,
        message: '查询成功',
        data: list,
      });
      return;
    } else {
      res.json({
        code: 500,
        message: '数据不存在',
      });
    }
  },
};
