import { useState, useRef, useEffect } from "react";
import { Input, Button, Card, Space, List, Avatar, Spin, message } from "antd";
import { SendOutlined, UserOutlined, RobotOutlined } from "@ant-design/icons";
import { ActionFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { deepseek } from "~/api/sever";
import { prisma } from "~/utils/db.server";

const { TextArea } = Input;

interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const formObject = Object.fromEntries(formData);

  if ("userMessage" in formObject) {
    try {
      const userMessage = JSON.parse(formObject.userMessage as string);
      const userId = formObject.userId as string | undefined;

      // 获取 AI 回复
      const aiResponse = await deepseek({
        role: "user",
        content: userMessage.content,
      });

      // 存储消息记录
      await prisma.message.create({
        data: {
          question: userMessage.content,
          answer: aiResponse as string,
          // 如果有 userId 则关联用户，否则设置为 null
          ...(userId ? { userId } : {}),
        },
      });

      return aiResponse;
    } catch (error) {
      console.error("Error appChat userMessage action:", error);
      return {
        success: false,
        message: "Error processing message",
      };
    }
  }
  return null;
};

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const textAreaRef = useRef<any>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data) {
      try {
        // 直接更新最后一条消息的内容
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && !lastMessage.isUser) {
            lastMessage.content = fetcher.data as string;
            lastMessage.isLoading = false;
          }
          return newMessages;
        });
      } catch (error) {
        console.log("Response was aborted");
      } finally {
        setIsTyping(false);
      }
    }
  }, [fetcher.data]);

  // 自动滚动到底部
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    // 取消之前的响应
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const userMessage: ChatMessage = {
      content: input.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    const loadingMessage: ChatMessage = {
      content: "",
      isUser: false,
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setInput("");
    setIsTyping(true);

    // 发送消息到服务器
    fetcher.submit(
      {
        userMessage: JSON.stringify(userMessage),
        // 如果有用户 ID，可以从 session 或 props 中获取
        // userId: currentUser?.id,
      },
      { method: "POST" }
    );
  };

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
            flexDirection: "column",
          }}
        >
          <List
            itemLayout="horizontal"
            dataSource={messages}
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
                      textAlign: "left",
                      marginLeft: message.isUser ? 0 : 8,
                      marginRight: message.isUser ? 8 : 0,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {message.isLoading ? (
                      <Spin size="small" />
                    ) : (
                      message.content
                    )}
                  </Card>
                </Space>
              </List.Item>
            )}
          />
        </div>

        {/* 输入区域 */}
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
          {isTyping ? (
            <Button
              danger
              onClick={() => {
                if (abortControllerRef.current) {
                  abortControllerRef.current.abort();
                  setIsTyping(false);
                  // 移除加载状态的消息
                  setMessages((prev) => prev.filter((msg) => !msg.isLoading));
                }
              }}
              style={{ height: "auto" }}
            >
              取消
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              style={{ height: "auto" }}
            >
              发送
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
