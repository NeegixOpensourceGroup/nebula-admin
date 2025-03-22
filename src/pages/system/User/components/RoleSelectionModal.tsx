import roleServices from '@/services/system/role';
import userServices from '@/services/system/user';
import { Modal, Transfer } from 'antd';
import React, { Key, useEffect, useState } from 'react';
const { queryAllRole } = roleServices.RoleController;
const { queryRolesByUser } = userServices.UserController;

// 定义组件的 props 类型
interface RoleSelectionModalProps {
  open: boolean;
  onOk: (userIds: number[], roleIds: string[]) => void;
  onCancel: () => void;
  userIds: number[];
}

interface RecordType {
  key: string;
  title: string;
  description: string;
  chosen: boolean;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  open,
  onOk,
  onCancel,
  userIds,
}) => {
  // 内部状态：选中的 key
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [mockData, setMockData] = useState<RecordType[]>([]);

  const fetchRoleList = async () => {
    try {
      const response = await queryAllRole();
      if (userIds.length === 1) {
        const rolesSesponse = await queryRolesByUser(userIds[0]);
        if (rolesSesponse.code === 200) {
          const roleIds = rolesSesponse.data.map((id: any) => id.toString());
          setTargetKeys(roleIds);
        } else {
          console.error(
            'Failed to fetch user role list:',
            rolesSesponse.message,
          );
        }
      }

      if (response.code === 200) {
        const roles = response.data.map((role: any) => ({
          key: role.id.toString(),
          title: role.description,
          description: role.description || '',
          chosen: false, // 根据实际需求设置默认选中状态
        }));
        setMockData(roles);
      } else {
        console.error('Failed to fetch role list:', response.message);
      }
    } catch (error) {
      console.error('Error fetching role list:', error);
    }
  };

  useEffect(() => {
    if (open) {
      setTargetKeys([]);
      setSelectedKeys([]);
      fetchRoleList();
    }
  }, [open]);

  // 处理 Transfer 组件的变化
  const handleChange = (newTargetKeys: React.Key[]) => {
    setTargetKeys(newTargetKeys as string[]);
  };

  // 过滤选项
  const filterOption = (
    inputValue: string,
    option: { key: string; title: string },
  ) => {
    return option.title.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
  };

  // 点击确认按钮时，将选中的 key 传递给 onOk
  const handleOk = () => {
    onOk(userIds, targetKeys);
  };

  const onSelectChange = (
    sourceSelectedKeys: Key[],
    targetSelectedKeys: Key[],
  ) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  return (
    <Modal
      title="选择角色"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      width={500} // 设置弹窗宽度为800px
      height={400}
    >
      <Transfer
        dataSource={mockData}
        targetKeys={targetKeys}
        onChange={handleChange}
        render={(item) => item.title}
        listStyle={{ width: 300, height: 400 }}
        showSearch
        filterOption={filterOption}
        pagination
        showSelectAll
        onSelectChange={onSelectChange}
        selectedKeys={selectedKeys}
      />
    </Modal>
  );
};

export default RoleSelectionModal;
