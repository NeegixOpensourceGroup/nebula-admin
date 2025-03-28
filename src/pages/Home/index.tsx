import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, Col, Row, Typography } from 'antd';
import Contributors from './components/Contributors';
import DevPlans from './components/DevPlans';
import ProjectOverview from './components/ProjectOverview';
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
    },
    { title: '导入导出', desc: '实现列表的快速导入导出开发', type: 'feature' },
    { title: '工作流支持', desc: '支持工作流开发', type: 'feature' },
    { title: '报表支持', desc: '支持报表开发', type: 'feature' },
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
    { title: '企业管理系统', desc: '适用于各类企业内部管理系统', type: 'tech' },
    {
      title: '数据分析平台',
      desc: '支持复杂的数据可视化和分析需求',
      type: 'eco',
    },
    { title: '工作流平台', desc: '可快速搭建业务流程管理系统', type: 'ops' },
    { title: '监控平台', desc: '适用于系统监控和运维管理', type: 'monitor' },
  ];

  // 项目更新记录
  const backendLogs = [
    { time: '2025-03-27', content: '优化新增校验的提示语' },
    { time: '2025-03-26', content: '升级springboot版本3.4.0->3.4.4' },
    { time: '2025-03-26', content: '登录人用户密码修改' },
    { time: '2025-03-26', content: '新建获取当前用户信息的工具，方便使用' },
    { time: '2025-03-26', content: '调整错误提示' },
    { time: '2025-03-25', content: '用户禁用后，不允许登录' },
    { time: '2025-03-24', content: '更新人员信息时报ID不能为空的bug处理' },
    { time: '2025-03-22', content: '用户绑定角色' },
    {
      time: '2025-01-16',
      content: '调整过期时间策略，如果访问过缓存，则重置过期时间',
    },
    { time: '2025-01-15', content: '优化登录日志信息' },
  ];

  const frontendLogs = [
    { time: '2025-03-27', content: '新增复制记录功能' },
    { time: '2025-03-27', content: '修复字典组操作后列表刷新问题' },
    { time: '2025-03-26', content: '优化字典组选择体验' },
    { time: '2025-03-26', content: '新增个人信息和密码修改功能' },
    { time: '2025-03-24', content: '优化角色和用户列表状态显示' },
    { time: '2025-03-24', content: '修复菜单权限标识问题' },
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
