import { Card, Col, Row, Timeline, Typography } from 'antd';
import React from 'react';

interface LogItem {
  time: string;
  content: string;
}

interface UpdateLogsProps {
  frontendLogs: LogItem[];
  backendLogs: LogItem[];
}

const UpdateLogs: React.FC<UpdateLogsProps> = ({
  frontendLogs,
  backendLogs,
}) => {
  return (
    <Card title="更新记录" style={{ height: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Typography.Text strong>前端</Typography.Text>
          <div
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
              paddingRight: '8px',
            }}
          >
            <Timeline
              items={frontendLogs.map((log) => ({
                children: (
                  <>
                    <div>{log.time}</div>
                    <div>{log.content}</div>
                  </>
                ),
              }))}
            />
          </div>
        </Col>
        <Col span={12}>
          <Typography.Text strong>后端</Typography.Text>
          <div
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
              paddingRight: '8px',
            }}
          >
            <Timeline
              items={backendLogs.map((log) => ({
                children: (
                  <>
                    <div>{log.time}</div>
                    <div>{log.content}</div>
                  </>
                ),
              }))}
            />
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default UpdateLogs;
