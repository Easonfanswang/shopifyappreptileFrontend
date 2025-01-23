import { useState, useEffect } from "react";
import { Card, Form, Input, Button, Typography, message } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import {
  Link,
  useFetcher,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { prisma } from "~/utils/db.server";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { handlePrismaError } from "~/function/prismaErrorHandle";
import { createUserSession, getUser } from "~/utils/session.server";

const { Title } = Typography;

// 检查用户是否已登录，如果已登录则重定向到首页
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  if (user) return redirect("/");
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const formObject = Object.fromEntries(formData);

  if ("loginFormData" in formObject) {
    try {
      const loginFormData = JSON.parse(formObject.loginFormData as string);

      const user = await prisma.user.findFirst({
        where: {
          email: loginFormData.email,
          password: loginFormData.password,
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      if (user) {
        // 创建用户 session 并重定向到首页
        return createUserSession(user.id, "/");
      } else {
        return {
          success: false,
          message: "用户名或密码错误",
        };
      }
    } catch (error) {
      console.error("Error login loginFormData action:", error);
      const errorResponse = handlePrismaError(error);
      return errorResponse;
    }
  }
  return null;
};

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const fetcher = useFetcher<any>();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (fetcher.data) {
      console.log(fetcher.data);

      if (fetcher.data.success) {
        navigate("/");
      } else {
        message.error(fetcher.data.message);
      }
    }
  }, [fetcher.data, navigate]);

  const onFinish = async (loginFormData: any) => {
    setLoading(true);
    try {
      fetcher.submit(
        {
          loginFormData: JSON.stringify(loginFormData),
        },
        { method: "POST" }
      );
      // 这里添加登录逻辑
      console.log("登录信息:", loginFormData);
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
