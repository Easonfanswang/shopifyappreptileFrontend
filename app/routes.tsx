import { DashboardOutlined, UserOutlined } from "@ant-design/icons";

export const routes = [
  {
    key: "/home",
    icon: <DashboardOutlined />,
    label: "首页",
    path: "/home",
  },
  {
    key: "/chat",
    icon: <UserOutlined />,
    label: "AI 聊天",
    path: "/chat",
  },
];
