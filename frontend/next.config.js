const path = require("path");

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")]
  },
  env: {
    BACKEND_HOST: process.env.BACKEND_HOST
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  async rewrites() {
    return [{destination: "/api/:path*", source: "/rest/:path*"}];
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
            replaceAttrValues: {
              "#000": "{props.fill}"
            }
          }
        },
        "url-loader"
      ]
    });

    return config;
  }
};
