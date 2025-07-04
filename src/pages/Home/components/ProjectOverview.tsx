import { GithubOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import React from 'react';

const ProjectOverview: React.FC = () => {
  return (
    <Card title="项目概览">
      <Row gutter={16}>
        <Col span={12}>
          <Typography.Title level={5}>前端项目</Typography.Title>
          <Row gutter={16}>
            <Col span={8}>
              <Statistic
                title="当前版本"
                value="1.1.0"
                prefix={<GithubOutlined />}
              />
            </Col>
            <Col span={8}>
              <Statistic title="代码提交" value={94} suffix="次" />
            </Col>
            <Col span={8}>
              <Statistic title="贡献者" value={1} suffix="人" />
            </Col>
          </Row>
          <Typography.Paragraph style={{ marginTop: 16 }}>
            Nebula Admin 是一个现代化的后台管理系统框架，前端基于 React、UmiMax
            和 Ant Design 构建，提供丰富的组件和优秀的开发体验。
          </Typography.Paragraph>
        </Col>
        <Col span={12}>
          <Typography.Title level={5}>后端项目</Typography.Title>
          <Row gutter={16}>
            <Col span={8}>
              <Statistic
                title="当前版本"
                value="1.1.0"
                prefix={<GithubOutlined />}
              />
            </Col>
            <Col span={8}>
              <Statistic title="代码提交" value={108} suffix="次" />
            </Col>
            <Col span={8}>
              <Statistic title="贡献者" value={1} suffix="人" />
            </Col>
          </Row>
          <Typography.Paragraph style={{ marginTop: 16 }}>
            后端采用 nebula-framework
            框架，基于DDD（领域驱动设计）理念构建，并提供 nebula-generator
            代码生成器实现快速开发。 系统基于 Spring Security
            实现了完善的权限设计，提供了丰富的组件和功能，帮助开发者快速构建安全可靠的企业级应用。
          </Typography.Paragraph>
        </Col>
      </Row>
      <Typography.Paragraph>
        <strong>代码仓库：</strong>
        <Row gutter={16}>
          <Col span={12}>
            <Typography.Title level={5}>
              前端项目：nebula-admin
            </Typography.Title>
            <ul>
              <li>
                <a
                  href="https://gitee.com/neegix-opensource-group/nebula-admin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Gitee
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/NeegixOpensourceGroup/nebula-admin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://gitcode.com/NeegixOpensourceGroup/nebula-admin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitCode
                </a>
              </li>
            </ul>
          </Col>
          <Col span={12}>
            <Typography.Title level={5}>
              后端框架：nebula-framework
            </Typography.Title>
            <ul>
              <li>
                <a
                  href="https://gitee.com/neegix-opensource-group/nebula-framework"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Gitee
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/NeegixOpensourceGroup/nebula-framework"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://gitcode.com/NeegixOpensourceGroup/nebula-framework"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitCode
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Typography.Paragraph>
    </Card>
  );
};

export default ProjectOverview;
