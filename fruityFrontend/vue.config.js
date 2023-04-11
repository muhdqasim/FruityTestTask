module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: this.apiUrl,
        changeOrigin: true,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }
    }
  }
}
