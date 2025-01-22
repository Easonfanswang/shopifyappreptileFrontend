import { useEffect, useState } from "react";
import { Card, Form, Input, Button, Typography, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "@remix-run/react";
import { ActionFunctionArgs, useFetcher } from "react-router-dom";
import { prisma } from "~/utils/db.server";
import { handlePrismaError } from "~/function/prismaErrorHandle";

const { Title } = Typography;

interface RegisterFormValues {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const formObject = Object.fromEntries(formData);

  if ("registerFormData" in formObject) {
    try {
      const registerFormData = JSON.parse(
        formObject.registerFormData as string
      );

      // 存储消息记录
      const response = await prisma.user.create({
        data: {
          email: registerFormData.email,
          password: registerFormData.password,
          name: registerFormData.name,
        },
      });

      return {
        success: true,
        message: "注册成功",
        data: response,
      };
    } catch (error) {
      console.error("Error appChat userMessage action:", error);
      const errorResponse = handlePrismaError(error);
      return errorResponse;
    }
  }
  return null;
};

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const fetcher = useFetcher();
  const navigate = useNavigate();

  useEffect(() => {
    if (fetcher.data) {
      console.log(fetcher.data);
      const { success } = fetcher.data;
      if (success) {
        setLoading(false);
        message.success(fetcher.data.message);
        navigate(`/login?email=${encodeURIComponent(fetcher.data.data.email)}`);
      } else {
        setLoading(false);
        message.error(fetcher.data.message);
      }
    }
  }, [fetcher.data, navigate]);

  const onFinish = async (registerFormData: RegisterFormValues) => {
    setLoading(true);
    fetcher.submit(
      {
        registerFormData: JSON.stringify(registerFormData),
        // 如果有用户 ID，可以从 session 或 props 中获取
        // userId: currentUser?.id,
      },
      { method: "POST" }
    );
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
          <Title level={2}>注册账号</Title>
        </div>

        <Form
          name="register"
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
            name="name"
            rules={[{ required: true, message: "请输入姓名" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="姓名" />
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

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "请确认密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次输入的密码不一致"));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              注册
            </Button>
          </Form.Item>

          <div
            style={{
              textAlign: "center",
              marginTop: 16,
            }}
          >
            已有账号？ <Link to="/login">立即登录</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
