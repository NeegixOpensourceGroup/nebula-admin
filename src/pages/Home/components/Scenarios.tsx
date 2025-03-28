import { AppstoreOutlined } from '@ant-design/icons';
import { Card, List, Typography } from 'antd';
import React from 'react';

interface ScenarioItem {
  title: string;
  desc: string;
  type: string;
}

interface ScenariosProps {
  scenarios: ScenarioItem[];
}

const Scenarios: React.FC<ScenariosProps> = ({ scenarios }) => {
  return (
    <Card title="应用场景" extra={<AppstoreOutlined />}>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={scenarios}
        renderItem={(item) => (
          <List.Item>
            <Card size="small" className={`scenario-${item.type}`}>
              <Typography.Title level={5}>{item.title}</Typography.Title>
              <Typography.Text type="secondary">{item.desc}</Typography.Text>
            </Card>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default Scenarios;
