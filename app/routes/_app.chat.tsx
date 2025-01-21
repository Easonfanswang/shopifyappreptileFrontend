import { useState, useRef, useEffect } from "react";
import { Input, Button, Card, Space, List, Avatar } from "antd";
import { SendOutlined, UserOutlined, RobotOutlined } from "@ant-design/icons";
import { ActionFunctionArgs } from "@remix-run/node";

const { TextArea } = Input;

interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = {};
  // 处理第二个 fetcher 的请求
  console.log("data:", data);
  return data;
};

const Index = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const textAreaRef = useRef<any>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      content: input,
      isUser: true,
      timestamp: new Date(),
    };

    const aiMessage: ChatMessage = {
      content: "这是一个模拟的AI回复。",
      isUser: false,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage, aiMessage]);
    setInput("");
  };

  // 自动滚动到底部
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      style={{ maxWidth: 800, margin: "0 auto", height: "calc(100vh - 140px)" }}
    >
      <Card
        style={{
          height: "100%",
        }}
        styles={{
          body: {
            height: "100%",
            padding: 0,
            display: "flex",
            flexDirection: "column",
            position: "relative",
          },
        }}
      >
        {/* 消息列表区域 */}
        <div
          ref={listRef}
          style={{
            flex: 1,
            overflow: "auto",
            padding: "24px",
            display: "flex",
            flexDirection: "column-reverse", // 消息从下往上排列
          }}
        >
          <List
            style={{
              display: "flex",
              flexDirection: "column-reverse", // 列表项从下往上排列
            }}
            itemLayout="horizontal"
            dataSource={[...messages].reverse()} // 反转消息数组
            renderItem={(message) => (
              <List.Item
                style={{
                  justifyContent: message.isUser ? "flex-end" : "flex-start",
                }}
              >
                <Space
                  align="start"
                  style={{
                    flexDirection: message.isUser ? "row-reverse" : "row",
                  }}
                >
                  <Avatar
                    icon={message.isUser ? <UserOutlined /> : <RobotOutlined />}
                    style={{
                      backgroundColor: message.isUser ? "#1890ff" : "#52c41a",
                    }}
                  />
                  <Card
                    size="small"
                    style={{
                      backgroundColor: message.isUser ? "#e6f7ff" : "#f6ffed",
                      textAlign: "center",
                      marginLeft: message.isUser ? 0 : 8,
                      marginRight: message.isUser ? 8 : 0,
                    }}
                  >
                    {message.content}
                  </Card>
                </Space>
              </List.Item>
            )}
          />
        </div>

        {/* 输入区域 - 固定在底部 */}
        <div
          style={{
            padding: "20px 24px",
            borderTop: "1px solid #f0f0f0",
            backgroundColor: "#fff",
            display: "flex",
            gap: 8,
          }}
        >
          <TextArea
            ref={textAreaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入你的问题..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            style={{ flex: 1 }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            style={{ height: "auto" }}
          >
            发送
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Index;
