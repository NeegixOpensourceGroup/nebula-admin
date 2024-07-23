import { Button, Result } from "antd";
import { history } from 'umi';

const NotFund: React.FC = () => {
  return (

      <Result
        status="404"
        title="404"
        subTitle="抱歉，该页面不存在"
        extra={<Button type="primary" onClick={()=>history.push("/home")}>返回首页</Button>}
      />

  );
}

export default NotFund;