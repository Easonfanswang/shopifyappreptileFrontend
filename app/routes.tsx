import {
  AppstoreOutlined,
  DashboardOutlined,
  MessageOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";

export const routes = [
  {
    key: "/home",
    icon: <DashboardOutlined />,
    label: "首页",
    path: "/home",
  },
  {
    key: "ai-tools",
    icon: <AppstoreOutlined />,
    label: "AI 工具箱",
    children: [
      {
        key: "/chat",
        icon: <MessageOutlined />,
        label: "AI 问答",
        path: "/chat",
      },
      // 可以在这里添加更多 AI 工具子菜单项
      // {
      //   key: "/translate",
      //   icon: <TranslationOutlined />,
      //   label: "AI 翻译",
      //   path: "/translate",
      // },
    ],
  },
  {
    key: "useful-tools",
    icon: <AppstoreOutlined />,
    label: "实用工具",
    children: [
      {
        key: "/neteaseCloudMusic",
        icon: <PlayCircleOutlined />,
        label: "网易云工具",
        path: "/neteaseCloudMusic",
      },
      // 可以在这里添加更多 AI 工具子菜单项
      // {
      //   key: "/translate",
      //   icon: <TranslationOutlined />,
      //   label: "AI 翻译",
      //   path: "/translate",
      // },
    ],
  },
];
