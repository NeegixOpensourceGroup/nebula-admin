import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, Col, Row, Typography } from 'antd';
import Contributors from './components/Contributors';
import DevPlans from './components/DevPlans';
import ProjectOverview from './components/ProjectOverview';
import QQGroupCard from './components/QQGroupCard';
import Scenarios from './components/Scenarios';
import TechStack from './components/TechStack';
import UpdateLogs from './components/UpdateLogs';
import styles from './index.less';

const HomePage: React.FC = () => {
  const { name } = useModel('global');

  // 技术栈信息
  const frontendTechStack = [
    {
      name: 'React',
      version: '18.0.0',
      desc: '用于构建用户界面的 JavaScript 库',
    },
    {
      name: 'TypeScript',
      version: '5.0.0',
      desc: '带有类型系统的 JavaScript 超集',
    },
    { name: 'UmiMax', version: '4.0.0', desc: '企业级前端开发框架' },
    {
      name: 'Ant Design',
      version: '5.0.0',
      desc: '企业级 UI 设计语言和 React 组件库',
    },
  ];

  const backendTechStack = [
    { name: 'SpringBoot', version: '3.0', desc: '简化Spring应用开发的框架' },
    { name: 'Java', version: '17', desc: '强大的企业级编程语言' },
    { name: 'MyBatis', version: '3.0', desc: '优秀的持久层框架' },
    { name: 'MySQL', version: '8.0', desc: '可靠的关系型数据库' },
  ];

  // 开发计划
  const devPlans = [
    {
      title: '现有模块优化',
      desc: '优化体验，功能完善，bug修复',
      type: 'feature',
      color: { background: '#f6ffed', borderColor: '#b7eb8f' },
    },
    {
      title: '导入导出',
      desc: '实现列表的快速导入导出开发',
      type: 'feature',
      color: { background: '#fff2e8', borderColor: '#ffbb96' },
    },
    {
      title: '工作流支持',
      desc: '支持工作流开发',
      type: 'feature',
      color: { background: '#e6f7ff', borderColor: '#91d5ff' },
    },
    {
      title: '报表支持',
      desc: '支持报表开发',
      type: 'feature',
      color: { background: '#fffbe6', borderColor: '#ffe58f' },
    },
  ];

  // 贡献人信息
  const contributors = [
    {
      name: 'kushu001',
      role: '全栈开发',
      avatar:
        'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      contributions: [
        '核心功能开发',
        '性能优化',
        'API设计',
        '数据库优化',
        '需求分析',
        '产品规划',
      ],
    },
  ];

  // 应用场景
  const scenarios = [
    {
      title: '学校课设或毕业设计',
      desc: '适合作为计算机相关专业的课程设计或毕业设计项目',
      type: 'edu',
    },
    {
      title: '私活或自有项目',
      desc: '适合个人开发者承接外包项目或开发自己的产品',
      type: 'personal',
    },
    {
      title: '中小企业内部项目',
      desc: '适合中小企业内部管理系统开发',
      type: 'business',
    },
  ];

  // 项目更新记录
  const backendLogs = [
    { time: '2025-07-03', content: 'perf(pom.xml): 更新版本号1.1.0' },
    {
      time: '2025-06-30',
      content: 'perf(.gitignore): 过滤不需要提交的文件配置',
    },
    { time: '2025-06-30', content: 'perf(fast-excel): 1.0.0->1.2.0' },
    { time: '2025-06-30', content: 'update: 更新文件 README.md' },
    {
      time: '2025-06-28',
      content: 'perf(readme): 去掉discard联系，集中社区维护',
    },
    { time: '2025-06-28', content: 'perf(readme): 修改README文档' },
    { time: '2025-06-28', content: 'perf(log): 列表数据倒序' },
    {
      time: '2025-06-28',
      content: 'perf(ModifyMinePasswordHandler): 调整获取当前用户的方法',
    },
    { time: '2025-06-28', content: 'perf(LogAspect): 调整获取当前用户的方法' },
  ];

  const frontendLogs = [
    { time: '2025-06-30', content: 'update: 更新文件 README.md' },
    {
      time: '2025-06-28',
      content: 'perf(readme): 去掉discord社区，集中维护qq群社区',
    },
    { time: '2025-06-28', content: 'perf(readme): 优化文档说明' },
    { time: '2025-06-27', content: 'perf(psn): 增加接口调用' },
    { time: '2025-06-20', content: 'perf(accessAPI): 修改访问mock数据' },
    { time: '2025-06-20', content: 'perf(README): 更新README说明' },
    { time: '2025-06-19', content: 'feat(all): 日期传参调整' },
    { time: '2025-06-13', content: 'fix(Role): 新增更新角色时报错处理' },
    { time: '2025-05-29', content: 'perf(all): 根据后端领域化改造' },
  ];

  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card>
              <Guide name={trim(name)} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={24}>
            <QQGroupCard />
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={16}>
            <ProjectOverview />
          </Col>

          <Col span={8}>
            <DevPlans devPlans={devPlans} />
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={8}>
            <TechStack
              frontendTechStack={frontendTechStack}
              backendTechStack={backendTechStack}
            />
          </Col>
          <Col span={8}>
            <Contributors contributors={contributors} />
          </Col>
          <Col span={8}>
            <UpdateLogs frontendLogs={frontendLogs} backendLogs={backendLogs} />
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Scenarios scenarios={scenarios} />
          </Col>
        </Row>

        <Row style={{ marginTop: 16, textAlign: 'center' }}>
          <Col span={24}>
            <Card>
              <Typography.Title level={4}>作者与版权</Typography.Title>
              <Typography.Paragraph>
                <strong>作者：</strong>kushu001
              </Typography.Paragraph>
              <Typography.Paragraph>
                <strong>开源协议：</strong>Apache License 2.0
              </Typography.Paragraph>
              <Typography.Paragraph>
                {' '}
                <strong>
                  版权所有 © 2024-present{' '}
                  <a href="https://www.neegix.com">NeegixOpensource</a>
                </strong>{' '}
              </Typography.Paragraph>
              <Typography.Paragraph>
                powered by{' '}
                <a href="https://umijs.org/docs/max/introduce">UmiMax</a> and{' '}
                <a href="https://ant-design.antgroup.com/docs/react/introduce-cn">
                  Ant Design 5.0
                </a>
              </Typography.Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};

export default HomePage;
