const viewport = {
  width: 1920,
  height: 1080,
};

const options = {
  headless: false,
  ignoreHTTPSErrors: true,
  chromiumSandbox: false,
};

const config = {
  projects: [
    {
      name: "Chromium",
      use: {
        browserName: "chromium",
        ...options,
        ...viewport,
      },
    },
  ],
};

module.exports = config;
