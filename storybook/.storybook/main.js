const path = require('path');

module.exports = {
  "stories": ["../../src/**/*.stories.mdx", "../../src/**/*.stories.@(js|jsx|ts|tsx)"],
  "addons": ["@storybook/addon-links", "@storybook/addon-essentials"],
  "framework": "@storybook/react",
  webpackFinal: async (config, {
    configType
  }) => {
    // . is .storybook, hence the ../build/dist
    config.resolve.alias["@brainstorm"] = path.resolve(__dirname, '../../build/dist/');
    return config;
  },
  features: {
    storyStoreV7: true
  },
  core: {
    builder: "webpack5"
  }
};