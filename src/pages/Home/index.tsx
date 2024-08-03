import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import styles from './index.less';

const HomePage: React.FC = () => {
  const { name } = useModel('global');
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <Guide name={trim(name)} />
        <div style={{ textAlign: 'center' }}>
          powered by <a href="https://umijs.org/docs/max/introduce">UmiMax</a>{' '}
          and{' '}
          <a href="https://ant-design.antgroup.com/docs/react/introduce-cn">
            Ant Design 5.0
          </a>
        </div>
      </div>
    </PageContainer>
  );
};

export default HomePage;
