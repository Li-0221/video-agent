// 配置优先级  docker env > env-config.js > .env

window.__ENV__ = {
  VITE_SERVICE_BASE_URL: 'https://mock.apifox.cn/m1/3109515-0-default',

  VITE_OTHER_SERVICE_BASE_URL: `{
    "demo": "http://localhost:9528"
  }`
};
