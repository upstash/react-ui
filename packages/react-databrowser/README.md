# @upstash/react-databrowser

<p align="center">
    <h2 align="center">Databrowser for Upstash Redis</h2>
</p>

---

## Introduction

`@upstash/react-databrowser` is a React component that provides a UI for browsing data in your Upstash Redis instances. It’s easy to set up and integrate into your React applications. This guide will help you get started with the installation and basic usage.

## Table of Contents

- [Install](#1-install)
- [Configuration](#2-configuration)
- [Usage](#3-usage)

## 1. Install

Install the databrowser component via npm:

```sh-session
$ npm install @upstash/react-databrowser
```

## 2. Configuration

### Environment Variables

Configure your Upstash Redis REST URL and token as environment variables:

```sh-session
NEXT_PUBLIC_UPSTASH_REDIS_REST_URL=YOUR_REDIS_REST_URL
NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN=YOUR_REDIS_REST_TOKEN
```

## 3. Usage

### Creating the Data Browser Component

In your React application, create a new component that will utilize @upstash/react-databrowser.

Here's a basic example of how to use the component:

```tsx
// /app/components/DatabrowserDemo.tsx

import { Databrowser } from "@upstash/react-databrowser"

import "@upstash/react-databrowser/dist/index.css"

export default function DatabrowserDemo() {
  const redisUrl = process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL
  const redisToken = process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN

  return (
    <main style={mainStyle}>
      <div style={divStyle}>
        <Databrowser token={redisToken} url={redisUrl} />
      </div>
    </main>
  )
}

const mainStyle = {
  height: "100vh",
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  background: "rgb(250,250,250)",
}

const divStyle = {
  height: "100%",
  width: "100%",
  maxHeight: "45rem",
  maxWidth: "64rem",
  borderRadius: "0.5rem",
  overflow: "hidden",
}
```
