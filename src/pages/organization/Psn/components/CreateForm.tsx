import bizUnitServices from '@/services/organization/bizUnit';
import deptServices from '@/services/organization/dept';
import dictServices from '@/services/system/dict';
import { buildTreeData } from '@/utils/tools';
import { PlusOutlined } from '@ant-design/icons';
import {
  DrawerForm,
  EditableFormInstance,
  EditableProTable,
  ProColumns,
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'umi';
const { queryDictItemByDictCode } = dictServices.DictController;
const { queryBizUnitList } = bizUnitServices.BizUnitController;
const { queryDeptList } = deptServices.DeptController;

type DataSourceType = {
  id: React.Key;
  pkBizUnit?: string | number;
  code?: string;
  type?: string;
  pkDept?: number;
  major: boolean;
  start?: Date;
  end?: Date;
  duty?: string;
  position?: string;
};

interface CreateFormProps {
  pkBizUnit?: number | string;
  onSubmit: (values: any) => Promise<boolean>;
}

const CreateForm: React.FC<CreateFormProps> = ({ pkBizUnit, onSubmit }) => {
  const intl = useIntl();
  const [form] = ProForm.useForm<any>();
  const [defaultData] = useState<DataSourceType[]>([
    {
      id: 2,
      pkBizUnit: pkBizUnit,
      code: '',
      type: '',
      pkDept: undefined,
      major: false,
      duty: '',
      position: '',
    },
  ]);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    defaultData.map((item) => item.id),
  );
  const [bizUnits, setBizUnits] = useState<any[]>([]);
  const editableFormRef = useRef<EditableFormInstance>();
  useEffect(() => {
    queryBizUnitList().then((res) => {
      if (res.code === 200) {
        const data = res.data;
        const treeData = buildTreeData(data, {
          idKey: 'id',
          nameKey: 'name',
          pidKey: 'pid',
        });
        setBizUnits(treeData);
      }
    });
  }, []);

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: intl.formatMessage({
        id: 'layout.organization.psn.workInfo.bizUnit',
      }),
      dataIndex: 'pkBizUnit',
      valueType: 'treeSelect',
      initialValue: pkBizUnit,
      fieldProps: (_, { rowIndex }) => {
        return {
          treeData: bizUnits,
          treeDefaultExpandAll: true,
          showSearch: true,
          treeNodeFilterProp: 'title',
          onSelect: () => {
            editableFormRef.current?.setRowData?.(rowIndex, {
              pkDept: undefined,
            });
          },
        };
      },
      width: 200,
    },
    {
      title: intl.formatMessage({
        id: 'layout.organization.psn.workInfo.code',
      }),
      dataIndex: 'code',
      width: 100,
    },
    {
      title: intl.formatMessage({
        id: 'layout.organization.psn.workInfo.kind',
      }),
      dataIndex: 'type',
      width: 100,
    },
    {
      title: intl.formatMessage({
        id: 'layout.organization.psn.workInfo.dept',
      }),
      dataIndex: 'pkDept',
      valueType: 'treeSelect',
      width: 150,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此为必填项',
          },
        ],
      },
      fieldProps: {
        showSearch: true,
        treeNodeFilterProp: 'title',
      },
      dependencies: ['pkBizUnit'],
      request: async ({ pkBizUnit }) => {
        const res = await queryDeptList(pkBizUnit);
        if (res.code === 200) {
          const treeData = buildTreeData(res.data, {
            idKey: 'id',
            nameKey: 'name',
            pidKey: 'pid',
          });
          return treeData;
        }
        return [];
      },
    },
    {
      title: intl.formatMessage({
        id: 'layout.organization.psn.workInfo.major',
      }),
      dataIndex: 'major',
      valueType: 'switch',
      width: 70,
    },
    {
      title: intl.formatMessage({
        id: 'layout.organization.psn.workInfo.start',
      }),
      dataIndex: 'start',
      valueType: 'date',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此为必填项',
          },
        ],
      },
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'layout.organization.psn.workInfo.end' }),
      dataIndex: 'end',
      valueType: 'date',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此为必填项',
          },
        ],
      },
      width: 150,
    },
    {
      title: intl.formatMessage({
        id: 'layout.organization.psn.workInfo.duty',
      }),
      dataIndex: 'duty',
      width: 100,
    },
    {
      title: intl.formatMessage({
        id: 'layout.organization.psn.workInfo.position',
      }),
      dataIndex: 'position',
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'layout.common.operate' }),
      valueType: 'option',
      width: 120,
      fixed: 'right',
    },
  ];

  return (
    <DrawerForm<any>
      title={
        <>
          <FormattedMessage id="layout.common.add" />{' '}
          <FormattedMessage id="layout.organization.psn.title" />
        </>
      }
      width={'90%'}
      form={form}
      trigger={
        <Button
          type="primary"
          onClick={() => {
            form.setFieldsValue({
              pkBizUnit: pkBizUnit,
              psnWorkInfos: [{ ...defaultData[0], pkBizUnit: pkBizUnit }],
            });
          }}
        >
          <PlusOutlined />
          <FormattedMessage id="layout.common.add" />
        </Button>
      }
      autoFocusFirstInput
      drawerProps={{
        destroyOnClose: true,
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        try {
          if (editableFormRef.current) {
            await editableFormRef.current.validateFields();
          }
        } catch (error) {
          console.error('Validation failed:', error);
        }
        return await onSubmit(values);
      }}
    >
      <ProForm.Group>
        <ProFormTreeSelect
          name="pkBizUnit"
          width="sm"
          label={<FormattedMessage id="layout.organization.bizUnit.title" />}
          disabled
          fieldProps={{
            treeData: bizUnits,
          }}
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
          label={intl.formatMessage({ id: 'layout.organization.psn.code' })}
        />
        <ProFormText
          rules={[
            {
              required: true,
            },
          ]}
          width="sm"
          name="name"
          label={intl.formatMessage({ id: 'layout.organization.psn.name' })}
        />
        <ProFormText
          width="sm"
          name="nickname"
          label={intl.formatMessage({ id: 'layout.organization.psn.nickname' })}
        />
        <ProFormSelect
          width="sm"
          name="gender"
          label={intl.formatMessage({ id: 'layout.organization.psn.gender' })}
          request={async () => {
            const res = await queryDictItemByDictCode('GENDER');
            return res.data.map((item: any) => {
              return {
                value: item.id,
                label: item.name,
              };
            });
          }}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDatePicker
          width="sm"
          name="birthday"
          label={intl.formatMessage({ id: 'layout.organization.psn.birthday' })}
        />
        <ProFormSelect
          width="sm"
          name="cardKind"
          label={intl.formatMessage({ id: 'layout.organization.psn.cardKind' })}
          request={async () => {
            const res = await queryDictItemByDictCode('CARD_KIND');
            return res.data.map((item: any) => {
              return {
                value: item.id,
                label: item.name,
              };
            });
          }}
        />
        <ProFormText
          width="sm"
          name="card"
          label={intl.formatMessage({ id: 'layout.organization.psn.cardNo' })}
        />
        <ProFormDatePicker
          width="sm"
          name="workDate"
          label={intl.formatMessage({ id: 'layout.organization.psn.workDate' })}
        />
        <ProFormText
          width="sm"
          name="homeAddress"
          label={intl.formatMessage({
            id: 'layout.organization.psn.homeAddress',
          })}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="sm"
          name="homeTel"
          label={intl.formatMessage({ id: 'layout.organization.psn.homeTel' })}
        />
        <ProFormText
          width="sm"
          name="workTel"
          label={intl.formatMessage({ id: 'layout.organization.psn.workTel' })}
        />
        <ProFormText
          width="sm"
          name="phone"
          label={intl.formatMessage({ id: 'layout.organization.psn.phone' })}
        />
        <ProFormText
          width="sm"
          name="email"
          label={intl.formatMessage({ id: 'layout.organization.psn.email' })}
          rules={[
            {
              type: 'email',
            },
          ]}
        />
        <ProFormSwitch
          width="sm"
          name="status"
          label={intl.formatMessage({ id: 'layout.organization.psn.status' })}
        />
      </ProForm.Group>
      <ProForm.Item
        label={intl.formatMessage({
          id: 'layout.organization.psn.workInfo.title',
        })}
        name="psnWorkInfos"
        trigger="onValuesChange"
      >
        <EditableProTable<DataSourceType>
          rowKey="id"
          scroll={{ x: 1200 }}
          toolBarRender={false}
          editableFormRef={editableFormRef}
          columns={columns}
          recordCreatorProps={{
            newRecordType: 'dataSource',
            position: 'top',
            record: () => ({
              id: Date.now(),
              pkBizUnit: pkBizUnit,
              code: '',
              type: '',
              pkDept: undefined,
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

export default CreateForm;
