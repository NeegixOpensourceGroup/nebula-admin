import { RocketOutlined } from '@ant-design/icons';
import { Card, Col, List, Row, Typography } from 'antd';
import React from 'react';

interface TechStackItem {
  name: string;
  version: string;
  desc: string;
}

interface TechStackProps {
  frontendTechStack: TechStackItem[];
  backendTechStack: TechStackItem[];
}

const TechStack: React.FC<TechStackProps> = ({
  frontendTechStack,
  backendTechStack,
}) => {
  return (
    <Card title="技术栈" extra={<RocketOutlined />}>
      <Row gutter={16}>
        <Col span={12}>
          <Typography.Title level={5} style={{ marginBottom: 16 }}>
            前端技术
          </Typography.Title>
          <List
            itemLayout="horizontal"
            dataSource={frontendTechStack}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={`${item.name} ${item.version}`}
                  description={item.desc}
                />
              </List.Item>
            )}
          />
        </Col>
        <Col span={12}>
          <Typography.Title level={5} style={{ marginBottom: 16 }}>
            后端技术
          </Typography.Title>
          <List
            itemLayout="horizontal"
            dataSource={backendTechStack}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={`${item.name} ${item.version}`}
                  description={item.desc}
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default TechStack;
