import {
  GoldOutlined,
  InboxOutlined,
  LoginOutlined,
  LogoutOutlined,
  SafetyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";
import { useGetDashboardQuery } from "../../feature/api/apiSlice";

export const DataInfo = () => {
  const { data: msg = {}, error, isLoading, isSuccess, isError } = useGetDashboardQuery();
  if (isLoading) {
    return <div>loading...</div>;
  }
  if (isError) {
    return <div>{error}</div>;
  }
  if (isSuccess) {
    let data = msg.data;
    return (
      <div>
        <Row gutter={16} className=" my-8">
          <Col span={12}>
            <Card bordered={true} hoverable={true}>
              <Statistic
                title="运行天数"
                value={data.days}
                valueStyle={{
                  color: "#3f8600",
                }}
                prefix={<SafetyOutlined />}
                suffix="天"
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered={true} hoverable={true}>
              <Statistic
                title="用户数量"
                value={data.usersnumber}
                valueStyle={{
                  color: "#3f8600",
                }}
                prefix={<UserOutlined />}
                suffix="人"
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={16} className=" my-8">
          <Col span={12}>
            <Card bordered={true} hoverable={true}>
              <Statistic
                title="产品种类"
                value={data.productsnumber}
                valueStyle={{
                  color: "#3f8600",
                }}
                prefix={<GoldOutlined />}
                suffix="件"
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered={true} hoverable={true}>
              <Statistic
                title="总库存数量"
                value={data.inventorynumber}
                valueStyle={{
                  color: "#3f8600",
                }}
                prefix={<InboxOutlined />}
                suffix="件"
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={16} className=" my-8">
          <Col span={12}>
            <Card bordered={true} hoverable={true}>
              <Statistic
                title="本月入库数量"
                value={data.inboundnumber}
                valueStyle={{
                  color: "#3f8600",
                }}
                prefix={<LoginOutlined />}
                suffix="件"
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered={true} hoverable={true}>
              <Statistic
                title="本月出库数量"
                value={data.outboundnumber}
                valueStyle={{
                  color: "#3f8600",
                }}
                prefix={<LogoutOutlined />}
                suffix="件"
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
};
