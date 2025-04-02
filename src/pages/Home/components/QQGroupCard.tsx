import { Card, Image, Typography } from 'antd';
import React from 'react';

const QQGroupCard: React.FC = () => {
  return (
    <Card title="社区交流">
      <div style={{ textAlign: 'center' }}>
        <Image
          src="https://neegix.com/img/qq_qrcode.jpg"
          alt="QQ群二维码"
          width={200}
          preview={false}
        />
        <Typography.Paragraph style={{ marginTop: 16 }}>
          <Typography.Text strong>群号: 996598075</Typography.Text>
        </Typography.Paragraph>
        <Typography.Paragraph>
          扫描二维码或搜索群号加入我们的技术交流群
        </Typography.Paragraph>
      </div>
    </Card>
  );
};

export default QQGroupCard;
