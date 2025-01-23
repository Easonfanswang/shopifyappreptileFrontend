import { useState } from "react";
import { Layout, Menu, MenuProps, Dropdown, Avatar } from "antd";
import { Outlet, Link, useLocation } from "@remix-run/react";
import { routes } from "../routes";
import { UserOutlined, LoginOutlined, LogoutOutlined, SettingOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;

const App = () => {
  const location = useLocation();
  // 这里添加用户登录状态判断，根据实际情况修改
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const menuItems: MenuProps["items"] = routes.map((route) => ({
    key: route.path,
    icon: route.icon,
    label: <Link to={route.path}>{route.label}</Link>,
  }));

  // 用户下拉菜单项
  const userMenuItems: MenuProps["items"] = isLoggedIn
    ? [
        {
          key: "profile",
          icon: <SettingOutlined />,
          label: <Link to="/profile">个人中心</Link>,
        },
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: "退出登录",
          onClick: () => {
            // 处理登出逻辑
            setIsLoggedIn(false);
          },
        },
      ]
    : [
        {
          key: "login",
          icon: <LoginOutlined />,
          label: <Link to="/login">登录</Link>,
        },
      ];

  return (
    <Layout>
      <Header
        style={{
          padding: 0,
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 200,
            height: "100%",
            display: "flex",
            alignItems: "center",
            paddingLeft: 24,
          }}
        >
          <h1 style={{ margin: 0, fontSize: 18 }}>Your Logo</h1>
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          style={{ flex: 1 }}
          items={menuItems}
        />
        {/* 添加头像和下拉菜单 */}
        <div style={{ padding: "0 24px" }}>
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
          >
            <Avatar
              style={{ cursor: "pointer" }}
              icon={<UserOutlined />}
              // 如果有用户头像，可以添加 src 属性
              // src={userAvatar}
            />
          </Dropdown>
        </div>
      </Header>
      <Content
        style={{
          padding: "24px",
          minHeight: "calc(100vh - 64px)",
          background: "#f0f2f5",
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  );
};

export default App;
