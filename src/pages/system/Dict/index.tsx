import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, Space, Table, message, Popconfirm, Form } from 'antd';
import type { TableProps, PopconfirmProps } from 'antd';
import type { SearchProps } from 'antd/es/input/Search';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProCard, ProColumns, ProTable, RequestData } from '@ant-design/pro-components/es';
import { FormProps } from 'antd/lib';
import  services  from '@/services/dict';

const { queryDictList, updateDict, addDict, removeDict } = services.DictController;

const dictItemData: DictItemDataType[] = [
  {
    key: '1',
    name: '男',
    value: '1',
  },
  {
    key: '2',
    name: '女',
    value: '2',
  }
];
const { Search } = Input;


const cancel: PopconfirmProps['onCancel'] = (e) => {
  if (e && typeof e.stopPropagation === 'function') {
    e.stopPropagation()
  }
  message.open({
    type: 'error',
    content: '删除取消',
    duration: 2,
  })
};

const DictList: React.FC = () => {
  const [groupForm] = Form.useForm();
  const [itemForm] = Form.useForm();
  const [openGroup, setOpenGroup] = useState(false); 
  const [openItem, setOpenItem] = useState(false);
  const [groupData, setGroupData] = useState<DictGroupDataType>();
  const [groupDataSource, setGroupDataSource] = useState<DictGroupDataType[]>([]);
  const [itemData, setItemData] = useState<DictItemDataType>();
  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  useEffect(() => {
    const queryDictGroupFun = async () => {
      const res = await queryDictList({...pagination});
      setGroupDataSource(res.data?.list);
      setPagination({
        current: res.data?.current,
        pageSize: res.data?.pageSize,
        total: res.data?.total,
      });
    }

    queryDictGroupFun();
  }, []);

  const onSearch: SearchProps['onSearch'] = async (value, _e, info) => {
    console.log(value, info, pagination);
    if(value){
      const res = await queryDictList({...pagination, name: value});
      setGroupDataSource(res.data?.list);
      setPagination({
        current: res.data?.current,
        pageSize: res.data?.pageSize,
        total: res.data?.total,
      });
    } else {
      const res = await queryDictList({...pagination});
      setGroupDataSource(res.data?.list);
    }
  };
  
  const showDictGroupModal = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, values?: DictGroupDataType) => {
    if(e && typeof e.stopPropagation === 'function'){
      e.stopPropagation()
    }
    setGroupData(values);
    setOpenGroup(!openGroup);
  };

  const showDictItemModal = (e: React.MouseEvent<HTMLAnchorElement>,  values?: DictItemDataType) => {
    if(e && typeof e.stopPropagation === 'function'){
      e.stopPropagation()
    }
    setItemData(values);
    setOpenItem(!openItem);
  };

  const onGroupFinish: FormProps<DictGroupDataType>['onFinish'] = async (values) => {
    if(groupData?.id){
      const res = await updateDict({ ...groupData, ...values });
      if(res.code === 200){
        message.open({
          type: 'success',
          content: res.message,
          duration: 2,
        })
        setOpenGroup(false)
      }
    } else {
      const res = await addDict(values);
      if(res.code === 200){
        message.open({
          type: 'success',
          content: res.message,
          duration: 2,
        })
        setOpenGroup(false)
      }
    }
    const resList = await queryDictList({...pagination});
    setGroupDataSource(resList.data?.list);
    setPagination({
      current: resList.data?.current,
      pageSize: resList.data?.pageSize,
      total: resList.data?.total,
    });
   
  };

  const confirm: PopconfirmProps['onConfirm'] = async (e) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation()
    }
  
    const res = await removeDict(1);
    if (res.code === 200) {
      const resList = await queryDictList({...pagination});
      setGroupDataSource(resList.data?.list);
      setPagination({
        current: resList.data?.current,
        pageSize: resList.data?.pageSize,
        total: resList.data?.total,
      });
      message.open({
        type: 'success',
        content: res.message,
        duration: 2,
      })
    }
  };

  const onItemFinish: FormProps<DictItemDataType>['onFinish'] = async (values) => {
    console.log('Success:', values);
  };

  const dictGroups: TableProps<DictGroupDataType>['columns'] = [
    {
      title: '序号',
      width: 40,
      render: (text, record, index) => (index + 1).toString(),
    },
    {
      title: '字典分类',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_e, record) => (
        <Space size="middle">
          <a onClick={(e) => showDictGroupModal(e as React.MouseEvent<HTMLAnchorElement>, record)}>编辑</a>
          <Popconfirm
            title="确定删除字典分类？"
            onConfirm={confirm}
            onCancel={cancel}
            okText="是"
            cancelText="否"
          >
            <a onClick={(e) => e.stopPropagation()}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const dictItems: ProColumns<DictItemDataType, "text">[] = [
    {
      title: '序号',
      width: 40,
      hideInSearch: true,
      render: (text, record, index) => (index + 1).toString(),
    },
    {
      title: '字典项名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '字典项值',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      hideInSearch: true,
      render: (_e, record) => (
        <Space size="middle">
          <a onClick={(e) => showDictItemModal(e as React.MouseEvent<HTMLAnchorElement>, record)}>编辑</a>
          <Popconfirm
            title="确定删除字典项？"
            onConfirm={confirm}
            onCancel={cancel}
            okText="是"
            cancelText="否"
          >
            <a onClick={(e) => e.stopPropagation()}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <PageContainer
      header={{
        title: '字典管理',
      }}
    >
      <ProCard split="vertical">
        <ProCard title="字典" colSpan="25%">
          <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Space size="middle">
              <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={(e) => showDictGroupModal(e as React.MouseEvent<HTMLAnchorElement>)} />
              <Search placeholder="输入字典分类" onSearch={onSearch} enterButton style={{ width: '100%' }}/>
            </Space>
            <Table columns={dictGroups} dataSource={groupDataSource}
              rowKey="id"
              pagination={{
                ...pagination
                ,
                onChange: (current, pageSize) => {
                  setPagination({
                    current: current,
                    pageSize: pageSize,
                    total: 0
                  })
                }
              }}
              onRow={(record) => {
                return {
                  onClick: (event) => {
                    // console.log(event, record);
                  }, // 点击行
                };
              }}/>
          </Space>
        </ProCard>
        <ProCard title="字典项" headerBordered>
          <ProTable search={{labelWidth: 0}}
           request={async (params, sort, filter) => {
            console.log(params, sort, filter);
            return new Promise<Partial<RequestData<DictItemDataType>>>((resolve, reject) => {
              // 使用params进行请求，然后将结果通过resolve传递
              // 示例：fetch数据
              setTimeout(() => {
                return resolve({});
              }, 100);
            });
          }}
           toolBarRender={() => [
              <Button key="button" icon={<PlusOutlined />} type="primary" onClick={(e)=>showDictItemModal(e as React.MouseEvent<HTMLAnchorElement>)}>
                新建
              </Button>
            ]
           }
           columns={dictItems} 
           dataSource={dictItemData} />
        </ProCard>
      </ProCard>
      <Modal
        title="新增字典分类"
        open={openGroup}
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={() => setOpenGroup(false)}
        onOk={() => setOpenGroup(true)}
        destroyOnClose
        okText="确认"
        cancelText="取消"
        width={300}
        modalRender={(dom) => (
          <Form
            form={groupForm}
            name="dictGroup"
            initialValues={groupData}
            clearOnDestroy
            onFinish={onGroupFinish}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item<DictGroupType> label="名称" name="name" rules={[{ required: true, message: '请输入字典分类名称' }]}>
          <Input placeholder="请输入字典分类名称" />
        </Form.Item>
      </Modal>
      <Modal
        title="新增字典项"
        open={openItem}
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={() => setOpenItem(false)}
        onOk={() => setOpenItem(true)}
        okText="确认"
        cancelText="取消"
        width={450}
        destroyOnClose
        modalRender={(dom) => (
          <Form
            form={itemForm}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 19 }}
            name="dictItem"
            initialValues={itemData}
            clearOnDestroy
            onFinish={onItemFinish}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item<DictItemType> label="字典项名称" name="name" rules={[{ required: true, message: '请输入字典项名称' }]}>
          <Input placeholder="请输入字典项名称" />
        </Form.Item>
        <Form.Item<DictItemType> label="字典项值" name="value" rules={[{ required: true, message: '请输入字典项值' }]}>
          <Input placeholder="请输入字典项值" />
        </Form.Item>
      </Modal>
    </PageContainer>
  );
};

export default DictList;
