interface DictGroupDataType {
  id: number;
  name: string;
}

interface DictItemDataType {
  id: number;
  dictId: number;
  name: string;
  value: string;
}

interface DictGroupType {
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