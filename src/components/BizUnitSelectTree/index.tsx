import React, { useEffect, useState } from 'react';
import { TreeSelect } from 'antd';
import type { TreeSelectProps } from 'antd';
import  bizUnitServices  from '@/services/bizUnit';
import { buildTreeData } from '@/utils/tools';
const  { queryBizUnitList } = bizUnitServices.BizUnitController;
interface BizUnitSelectTreeProps {
  onChange?: (value: string) => void;
}
const BizUnitSelectTree: React.FC<BizUnitSelectTreeProps> = ({onChange}) => {
  const [value, setValue] = useState<string>();
  const [bizUnitTreeData, setBizUnitTreeData] = useState<any[]>([]);

  const onPopupScroll: TreeSelectProps['onPopupScroll'] = (e) => {
    console.log('onPopupScroll', e);
  };
  const onChangeTree = (newValue:any) => {
    setValue(newValue);
    if(onChange)onChange(newValue)
  };

  useEffect(() => {
    queryBizUnitList().then((res: any) => {
      if (res.code === 200) {
        const data = res.data;
        onChangeTree(data[0].id)
        const treeData = buildTreeData(data, {
          idKey: 'id',
          nameKey: 'name',
          pidKey: 'pid'
        })
        setBizUnitTreeData(treeData)
        setValue(data[0].id)
      }
    })
  }, []);


  return (
    <TreeSelect
      showSearch
      style={{ width: 300 }}
      value={value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder="请选择业务单元"
      allowClear
      treeDefaultExpandAll
      onChange={onChangeTree}
      treeData={bizUnitTreeData}
      onPopupScroll={onPopupScroll}
    />
  );
};

export default BizUnitSelectTree;