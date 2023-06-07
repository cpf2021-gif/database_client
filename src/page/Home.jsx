import {
  MenuFoldOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  TableOutlined,
  ReconciliationOutlined,
  AreaChartOutlined,
} from "@ant-design/icons";

import { Button, Layout, Menu, theme, message } from "antd";
import { useState } from "react";

import { User } from "../component/User";
import { Product } from "../component/Product";
import { Supplier } from "../component/Supplier";
import { Inventory } from "../component/Inventory";
import { Inbound } from "../component/Inbound";
import { Outbound } from "../component/Outbound";
import { UserInfo } from "../component/UserInfo";
import { AddUser } from "../component/AddUser";
import { AddProduct } from "../component/AddProduct";
import { DataInfo } from "../component/DataInfo";
import { OrderForm } from "../component/OrderForm";
import { ExportForm } from "../component/ExportForm";
import { Seller } from "../component/Seller";

import data from "../../src/data";

const { Header, Sider, Content } = Layout;

function getItem(label, key, icon, children) {
  return {
    label,
    key,
    icon,
    children,
  };
}

const items = [
  getItem("用户管理", "1", <UserOutlined />, [
    getItem("用户信息", "1-1"),
    getItem("权限管理", "1-2"),
    getItem("添加用户", "1-3"),
  ]),
  getItem("产品管理", "2", <TableOutlined />, [
    getItem("产品信息", "2-1"),
    getItem("供应商信息", "2-2"),
    getItem("销售商信息", "2-3"),
    getItem("新增内容", "2-4"),
  ]),
  getItem("库存管理", "3", <ReconciliationOutlined />, [
    getItem("库存信息", "3-1"),
    getItem("入库信息", "3-2"),
    getItem("出库信息", "3-3"),
    getItem("订单管理", "3-4"),
  ]),
  getItem("数据分析", "4", <AreaChartOutlined />, [
    getItem("整体数据", "4-1"),
    getItem("导出数据", "4-2"),
  ]),
];

export const Home = ({ user, setuser }) => {
  const [msg, setMsg] = useState(<UserInfo username={user.username} />);

  const [messageApi, contextHolder] = message.useMessage();

  // 成功提示
  const success = (content) => {
    messageApi.open({
      type: "success",
      content: content,
      duration: 1,
    });
  };

  // 失败提示
  const error = (content) => {
    messageApi.open({
      type: "error",
      content: content,
      duration: 1,
    });
  };

  // 折叠菜单
  const [collapsed, setcollapsed] = useState(false);
  const [selectedKeys, setselectedKeys] = useState(["1-1"]);

  // 退出登录
  const handleLogout = async () => {
    await fetch("http://localhost:8080/logout", {
      method: "GET",
    });
    success("退出成功");
    setTimeout(() => {
      setuser({});
    }, 1000);
  };

  // 备份数据
  const handleBackup = async () => {
    await fetch("http://localhost:8080/backup", {
      method: "GET",
    });
    success("备份成功");
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1-1"]}
          selectedKeys={selectedKeys}
          items={items}
          onClick={(e) => {
            if (!data[user.role].includes(e.key)) {
              error("您没有权限访问该页面");
              setselectedKeys(["1-1"]);
              setMsg(<UserInfo username={user.username} />);
              return;
            }

            setselectedKeys([e.key]);
            switch (e.key) {
              case "1-1":
                setMsg(<UserInfo username={user.username} />);
                break;
              case "1-2":
                setMsg(<User />);
                break;
              case "1-3":
                setMsg(<AddUser user={user} setuser={setuser} />);
                break;
              case "2-1":
                setMsg(<Product />);
                break;
              case "2-2":
                setMsg(<Supplier />);
                break;
              case "2-3":
                setMsg(<Seller />);
                break;
              case "2-4":
                setMsg(<AddProduct />);
                break;
              case "3-1":
                setMsg(<Inventory />);
                break;
              case "3-2":
                setMsg(<Inbound />);
                break;
              case "3-3":
                setMsg(<Outbound />);
                break;
              case "3-4":
                setMsg(<OrderForm username={user.username} />);
                break;
              case "4-1":
                setMsg(<DataInfo />);
                break;
              case "4-2":
                setMsg(<ExportForm />);
                break;
              default:
                break;
            }
          }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setcollapsed(!collapsed)}
          />
          <div className=" flex justify-end mx-4">
            <Button
              type="primary"
              disabled={!(user.role == "admin" || user.role == "editor")}
              className=" mx-4"
              onClick={() => {
                handleBackup();
              }}
            >
              备份
            </Button>
            <Button
              type="primary"
              onClick={() => {
                handleLogout();
              }}
            >
              Logout
            </Button>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 660,
            background: colorBgContainer,
          }}
        >
          {contextHolder}
          {msg}
        </Content>
      </Layout>
    </Layout>
  );
};
