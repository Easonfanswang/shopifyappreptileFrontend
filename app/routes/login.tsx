import { useState, useEffect } from "react";
import { Card, Form, Input, Button, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Link, useSearchParams } from "@remix-run/react";

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();

  // 获取 URL 参数中的邮箱并设置到表单中
  useEffect(() => {
    const email = searchParams.get("email");
    if (email) {
      form.setFieldsValue({ email });
      // 自动聚焦到密码输入框
      setTimeout(() => {
        const passwordInput = document.querySelector('input[type="password"]');
        if (passwordInput) {
          (passwordInput as HTMLElement).focus();
        }
      }, 100);
    }
  }, [searchParams, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // 这里添加登录逻辑
      console.log("登录信息:", values);
    } catch (error) {
      console.error("登录失败:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100%",
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={2}>欢迎登录</Title>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "请输入邮箱" },
              { type: "email", message: "请输入有效的邮箱地址" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="邮箱" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "请输入密码" },
              { min: 6, message: "密码至少6个字符" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>

          <div
            style={{
              textAlign: "center",
              marginTop: 16,
            }}
          >
            还没有账号？ <Link to="/register">立即注册</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
