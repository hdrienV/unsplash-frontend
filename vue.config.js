module.exports = {
  devServer: {
    port: 8081,
    liveReload: true,
    hot: true,
    inline: true,
    proxy: {
      "/api/v1/image": {
        target: "http://localhost:9000",
        secure: false
      }
    }
  }
};
