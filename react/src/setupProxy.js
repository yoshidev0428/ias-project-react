const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_PROXY_HOST,
      changeOrigin: true,
      pathRewrite: {
        '^/api/': '/',
      },
    }),
  );
  app.use(
    '/ilastik-api',
    createProxyMiddleware({
      target:
        process.env.REACT_APP_ILASTIK_PROXY_HOST || 'http://localhost:8001/',
      changeOrigin: true,
      pathRewrite: {
        '^/ilastik-api/': '/',
      },
    }),
  );
};
