const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://72.233.250.83:3000',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    })
  );
  app.use(
    '/data',
    createProxyMiddleware({
      target: 'http://72.233.250.83:8080',
      changeOrigin: true,
    })
  );
};
