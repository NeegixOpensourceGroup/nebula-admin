import { ToolOutlined } from '@ant-design/icons';
import { Card, List, Typography } from 'antd';
import React from 'react';

interface DevPlanItem {
  title: string;
  desc: string;
  type: string;
  color: { background: string; borderColor: string };
}

interface DevPlansProps {
  devPlans: DevPlanItem[];
}

const DevPlans: React.FC<DevPlansProps> = ({ devPlans }) => {
  return (
    <Card title="开发计划" extra={<ToolOutlined />}>
      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={devPlans}
        renderItem={(item) => (
          <List.Item>
            <Card size="small" style={item.color}>
              <Typography.Title level={5}>{item.title}</Typography.Title>
              <Typography.Text type="secondary">{item.desc}</Typography.Text>
            </Card>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default DevPlans;
