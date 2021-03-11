module.exports = {
  devServer: {
    port: 8081,
    proxy: {
      "/api/v1/getImages": {
        target: "http://localhost:9000",
        secure: false
      }
    }
  }
};
