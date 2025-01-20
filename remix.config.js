/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "esm",
  future: {
    v2_errorBoundary: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
  // 添加这个配置来处理 CSS
  serverDependenciesToBundle: [
    /^antd.*/,
    /@ant-design\/icons/,
  ],
};
