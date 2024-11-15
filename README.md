# RedisBrowser for Upstash Redis

`@upstash/react-redis-browser` is a React component that provides a CLI interface to interact with Upstash Redis.

<img src="public%2Fredis-cli.png" width="640px" />

### Install

Install the component via npm:

```bash
$ npm install @upstash/react-redis-cli
```

### Usage

Here's a basic example of how to use the component:

```tsx
import { RedisCli } from "@upstash/react-redis-cli"

import "@upstash/react-redis-cli/dist/index.css"

export default function Page() {
  return (
    <main style={mainStyle}>
      <RedisCli url={UPSTASH_REDIS_REST_URL} token={UPSTASH_REDIS_REST_TOKEN} />
    </main>
  )
}

const mainStyle = {
  width: "100vw",
  maxWidth: "900px",
  height: "500px",
  margin: "0 auto",
}
```
