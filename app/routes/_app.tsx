import { useState } from "react";
import { Layout, Menu, MenuProps } from "antd";
import { Outlet, Link, useLocation } from "@remix-run/react";
import { routes } from "../routes";

const { Header, Content } = Layout;

const App = () => {
  const location = useLocation();

  const menuItems: MenuProps["items"] = routes.map((route) => ({
    key: route.path,
    icon: route.icon,
    label: <Link to={route.path}>{route.label}</Link>,
  }));
  
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
        ></Menu>
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
