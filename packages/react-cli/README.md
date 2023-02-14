<div align="center">
    <h1 align="center">@upstash/react-cli</h1>
    <h5>CLI for Upstash Redis</h5>
</div>

<div align="center">
  <a href="https://console.upstash.com/redis">console.upstash.com/redis</a>
</div>
<br/>


## Install

```sh-session
$ npm install @upstash/react-cli
```

Add the package in your `next.config.js` file:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ["@upstash/react-cli"],
};

module.exports = nextConfig;
```



```tsx
import "@upstash/react-cli/dist/index.css";
import { RedisCli } from "@upstash/react-cli";

<RedisCli url="UPSTASH_REDIS_REST_URL" token="UPSTASH_REDIS_REST_TOKEN"/>

```