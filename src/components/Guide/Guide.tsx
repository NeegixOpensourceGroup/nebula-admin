import { RocketOutlined } from '@ant-design/icons';
import { Layout, Row, Typography } from 'antd';
import React from 'react';
import { FormattedMessage } from 'umi';
import styles from './Guide.less';
interface Props {
  name: string;
}

// 脚手架示例组件
const Guide: React.FC<Props> = (props) => {
  // 由于name未被使用，可以移除解构
  const {} = props;
  return (
    <Layout className={styles.container}>
      <Row align="middle" justify="center" style={{ height: '100%' }}>
        <Typography.Title level={2} className={styles.title}>
          <RocketOutlined className={styles.icon} />
          <span className={styles.gradientText}>Nebula</span>
          <span className={styles.subTitle}>欢迎来到Neegix世界</span>
          <div className={styles.divider} />
          <FormattedMessage id="welcome" />
        </Typography.Title>
      </Row>
    </Layout>
  );
};

export default Guide;
