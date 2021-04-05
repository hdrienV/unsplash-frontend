module.exports = {
  devServer: {
    port: 8081,
    liveReload: false,
    hot: false,
    inline: false,
    proxy: {
      "/api/v1/image": {
        target: "http://localhost:9000",
        secure: false
      }
    }
  }
};
