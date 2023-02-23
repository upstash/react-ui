"use client";

import { RedisCli } from "@upstash/react-cli";

export const Cli: React.FC<{
  url: string;
  token: string;
}> = (props) => {
  return <RedisCli {...props} />;
};
