import { useState } from "react";
import { Layout, Menu, MenuProps, Dropdown, Avatar } from "antd";
import {
  Outlet,
  Link,
  useLocation,
  useLoaderData,
  useFetcher,
  Form,
} from "@remix-run/react";
import { routes } from "../routes";
import {
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { getUser } from "~/utils/session.server";

const { Header, Content } = Layout;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  return json({
    isLoggedIn: !!user,
    user,
  });
};

const App = () => {
  const { isLoggedIn, user } = useLoaderData<typeof loader>();

  const [isLogIn, setIsLogIn] = useState<boolean>(isLoggedIn);
  const fetcher = useFetcher<any>();
  const location = useLocation();
  // 这里添加用户登录状态判断，根据实际情况修改

  const menuItems: MenuProps["items"] = routes.map((route) => {
    // 如果有子菜单
    if (route.children) {
      return {
        key: route.key,
        icon: route.icon,
        label: route.label,
        children: route.children.map((child) => ({
          key: child.key,
          icon: child.icon,
          label: <Link to={child.path}>{child.label}</Link>,
        })),
      };
    }

    // 如果是普通菜单项
    return {
      key: route.key,
      icon: route.icon,
      label: route.path ? (
        <Link to={route.path}>{route.label}</Link>
      ) : (
        route.label
      ),
    };
  });

  const handleLogout = () => {
    fetcher.submit(null, { method: "POST", action: "/logout" });
    setIsLogIn(false);
  };

  // 用户下拉菜单项
  const userMenuItems: MenuProps["items"] = isLoggedIn
    ? [
        {
          key: "profile",
          icon: <SettingOutlined />,
          label: <Link to="/user">个人中心</Link>,
        },
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: (
            <Form action="/logout" method="post">
              <button
                type="submit"
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  color: "inherit",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                退出登录
              </button>
            </Form>
          ),
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
