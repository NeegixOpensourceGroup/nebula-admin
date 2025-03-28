import { TeamOutlined } from '@ant-design/icons';
import { Card, List } from 'antd';
import React from 'react';

interface ContributorItem {
  name: string;
  role: string;
  avatar: string;
  contributions: string[];
}

interface ContributorsProps {
  contributors: ContributorItem[];
}

const Contributors: React.FC<ContributorsProps> = ({ contributors }) => {
  return (
    <Card title="贡献人" extra={<TeamOutlined />} style={{ height: '100%' }}>
      <List
        itemLayout="horizontal"
        dataSource={contributors}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <img
                  src={item.avatar}
                  alt={item.name}
                  style={{ width: 32, borderRadius: '50%' }}
                />
              }
              title={`${item.name} - ${item.role}`}
              description={item.contributions.join('、')}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default Contributors;
