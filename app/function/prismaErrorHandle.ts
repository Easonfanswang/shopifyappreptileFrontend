export interface PrismaErrorResponse {
  success: boolean;
  message: string;
  data: any;
  code?: string;
}

// Prisma 错误代码映射表
const prismaErrorMessages: { [key: string]: string } = {
  P2000: "提供的数据太长",
  P2001: "记录不存在",
  P2002: "记录已存在", // 唯一性约束违反
  P2003: "外键约束失败",
  P2004: "数据库约束失败",
  P2005: "数据库值类型错误",
  P2006: "提供的值无效",
  P2007: "数据验证错误",
  P2008: "查询解析失败",
  P2009: "查询验证失败",
  P2010: "原始数据库错误",
  P2011: "值为空",
  P2012: "缺少必需字段",
  P2013: "缺少必需参数",
  P2014: "关系错误",
  P2015: "关系不存在",
  P2016: "查询解释错误",
  P2017: "记录不存在",
  P2018: "需要连接表",
  P2019: "输入错误",
  P2020: "值超出范围",
  P2021: "表不存在",
  P2022: "列不存在",
  P2023: "不一致的列数据",
  P2024: "连接超时",
  P2025: "记录不存在",
  P2026: "需要提供记录",
  P2027: "多个记录错误",
  P2028: "事务API错误",
  P2030: "完整性约束失败",
};

// 针对特定字段的唯一性约束错误消息
const uniqueConstraintMessages: { [key: string]: string } = {
  email: "该邮箱已被注册",
  username: "该用户名已被使用",
  phone: "该手机号已被注册",
};

export const handlePrismaError = (error: any): PrismaErrorResponse => {
  console.error("Prisma Error:", error);

  // 处理唯一性约束错误
  if (error.code === "P2002") {
    const target = error.meta?.target?.[0];
    const message = target
      ? uniqueConstraintMessages[target] || "该记录已存在"
      : "记录已存在";

    return {
      success: false,
      message,
      data: {},
      code: error.code,
    };
  }

  // 处理其他 Prisma 错误
  return {
    success: false,
    message: prismaErrorMessages[error.code] || "操作失败，请稍后重试",
    data: {},
    code: error.code,
  };
};
