import {
  DrawerForm,
  ProForm,
  EditableProTable,
  ProFormText,
  ProColumns,
  ProFormDatePicker,
  ProFormSwitch,
  ProFormTreeSelect,
  ProFormSelect,
  EditableFormInstance,
} from '@ant-design/pro-components';
import { Form } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import psnServices from '@/services/organization/psn';
import  bizUnitServices  from '@/services/organization/bizUnit';
import { buildTreeData } from '@/utils/tools';
import  dictServices from '@/services/system/dict';
import deptServices  from '@/services/organization/dept';
const { queryDictItemByDictCode } = dictServices.DictController;
const  { queryBizUnitList } = bizUnitServices.BizUnitController;
const {queryDeptList} = deptServices.DeptController;
const { getPsnDetail } = psnServices.PsnController;

type DataSourceType = {
  id: React.Key;
  bizUnitPk?: string|number;
  code?: string;
  kind?: string;
  dept?: string;
  major: boolean;
  start?: Date;
  end?: Date;
  duty?: string;
  position?: string;
};

interface UpdateFormProps {
  id?: number|string;
  bizUnitId?: number|string;
  onSubmit: (values: any) => Promise<boolean>;
}
const UpdateForm: React.FC<UpdateFormProps> = ({id, bizUnitId, onSubmit}) => {
  const [form] = Form.useForm<any>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>();
  const [bizUnits, setBizUnits] = useState<any[]>([]);
  const editableFormRef = useRef<EditableFormInstance>();
  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '任职业务单元',
      dataIndex: 'bizUnitPk',
      valueType: 'treeSelect',
      initialValue: bizUnitId,
      fieldProps: (_, { rowIndex })=>{
        return {
          treeData: bizUnits,
          treeDefaultExpandAll: true,
          showSearch: true,
          treeNodeFilterProp:"title",
          onSelect: () => {
            editableFormRef.current?.setRowData?.(rowIndex, { dept: undefined });
          }
        }
      },
      width: 200,
    },
    {
      title: '员工编号',
      dataIndex: 'code',
      width: 100,
    },
    {
      title: '人员类别',
      dataIndex: 'kind',
      width: 100,
    },
    {
      title: '所在部门',
      dataIndex: 'dept',
      valueType: 'treeSelect',
      width: 150,
      fieldProps: {
        showSearch: true,
        treeNodeFilterProp: "title",
      },
      dependencies: ['bizUnitPk'],
      request: async ({bizUnitPk}) => {
        const res = await queryDeptList(bizUnitPk);
        if (res.code === 200) {
          const treeData = buildTreeData(res.data, {
            idKey: 'id',
            nameKey: 'name',
            pidKey: 'pid'
          })
          return treeData
        }
        return []
      },
    },
    {
      title: '是否主职',
      dataIndex: 'major',
      valueType: 'switch',
      width: 70,
    },
    {
      title: '任职开始日期',
      dataIndex: 'start',
      valueType: 'date',
      width: 150,
    },
    {
      title: '任职结束日期',
      dataIndex: 'end',
      valueType: 'date',
      width: 150,
    },
    {
      title: '职务',
      dataIndex: 'duty',
      width: 100,
    },
    {
      title: '岗位',
      dataIndex: 'position',
      width: 100,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 120,
      fixed: 'right'
    },
  ];
  useEffect(() => {
    queryBizUnitList().then(res => {
      if (res.code === 200) {
        const data = res.data;
          const treeData = buildTreeData(data, {
          idKey: 'id',
          nameKey: 'name',
          pidKey: 'pid'
        })
        setBizUnits(treeData);
      }
    })
 }, [])
  const detailHandler = async () => {
    const res = await getPsnDetail(id);
    if (res.code === 200) {
      form.setFieldsValue(res.data);
      setEditableRowKeys(res.data.dataSource.map((item:any) => item.id));
    }
  }

  return (
    <DrawerForm<any>
      title="编辑人员"
      width={'90%'}
      form={form}
      trigger={
        <a onClick={detailHandler}>编辑</a>
      }
      autoFocusFirstInput
      drawerProps={{
        destroyOnClose: true,
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        return await onSubmit({...values, id});
      }}
    >
      <ProForm.Group>
        <ProFormTreeSelect
          name="bizUnitPk"
          width="sm"
          label="业务单元"
          tooltip="最长为 24 位"
          placeholder="请选择业务单元"
          fieldProps={
            {
              treeData: bizUnits
            }
          }
          disabled
          rules={[
            {
              required: true,
            },
          ]}
        />
        <ProFormText
          rules={[
            {
              required: true,
            },
          ]}
          width="sm"
          name="code"
          label="人员编码"
          placeholder="请输入编码"
        />
        <ProFormText
          rules={[
            {
              required: true,
            },
          ]}
          width="sm"
          name="name"
          label="姓名"
          placeholder="请输入姓名"
        />
        <ProFormText
          width="sm"
          name="nickname"
          label="昵称"
          placeholder="请输入昵称"
        />
        <ProFormSelect
          width="sm"
          name="gender"
          label="性别"
          placeholder="请选择性别"
          request={async () => {
            const res = await queryDictItemByDictCode('GENDER');
            return res.data.map((item:any) => {
              return {
                value: item.id,
                label: item.name,
              }
            })
          }}
        />
      </ProForm.Group>
      <ProForm.Group>
      <ProFormDatePicker
          width="sm"
          name="birthday"
          label="出生日期"
          placeholder="请选择出生日期"
        />
        <ProFormSelect
          width="sm"
          name="cardKind"
          label="证件类型"
          placeholder="请选择证件类型"
          request={async () => {
            const res = await queryDictItemByDictCode('CARD_KIND');
            return res.data.map((item:any) => {
              return {
                value: item.id,
                label: item.name,
              }
            })
          }}
        />
        <ProFormText
          width="sm"
          name="card"
          label="证件号"
          placeholder="请输入证件号"
        />
        <ProFormDatePicker
          width="sm"
          name="workDate"
          label="参加工作日期"
          placeholder="请选择参加工作日期"
        />
        <ProFormText
          width="sm"
          name="homeAddress"
          label="家庭地址"
          placeholder="请输入家庭地址"
        />
      </ProForm.Group>
      <ProForm.Group>
      <ProFormText
          width="sm"
          name="homeTel"
          label="家庭电话"
          placeholder="请输入家庭电话"
        />
        <ProFormText
          width="sm"
          name="workTel"
          label="工作电话"
          placeholder="请输入工作电话"
        />
        <ProFormText
          width="sm"
          name="phone"
          label="手机号"
          placeholder="请输入手机号"
        />
        <ProFormText
          width="sm"
          name="email"
          label="电子邮箱"
          placeholder="请输入电子邮箱"
          rules={[
            {
              type: 'email',
              message: '请输入正确的邮箱地址',
            }
          ]}
        />
        <ProFormSwitch
          width="sm"
          name="status"
          label="启用状态"
        />
      </ProForm.Group>
      <ProForm.Item
        label="人员工作信息"
        name="dataSource"
        trigger="onValuesChange"
      >
        <EditableProTable<DataSourceType>
          rowKey="id"
          scroll={{ x: 1200 }}
          toolBarRender={false}
          columns={columns}
          editableFormRef={editableFormRef}
          recordCreatorProps={{
            newRecordType: 'dataSource',
            position: 'top',
            record: () => ({
              id: Date.now(),
              bizUnitPk: bizUnitId,
              code: '000001',
              kind: '',
              dept:'',
              major: false,
              duty: '',
              position: '',
            }),
          }}
          editable={{
            type: 'multiple',
            editableKeys,
            onChange: setEditableRowKeys,
            actionRender: (row, _, dom) => {
              return [dom.delete];
            },
          }}
        />
      </ProForm.Item>
    </DrawerForm>
  );
};

export default UpdateForm;