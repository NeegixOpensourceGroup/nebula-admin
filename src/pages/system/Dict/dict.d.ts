interface DictGroupDataType {
  id: number;
  name: string;
}

interface DictItemDataType {
  id: number;
  pkDictGroup: number;
  name: string;
  value: string;
}

interface DictGroupType {
  code: string;
  name: string;
}

interface DictItemType {
  name: string;
  value: string;
}

interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}
