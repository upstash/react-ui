"use client";

import { RedisCli } from "@upstash/react-cli";
import "@upstash/react-cli/dist/index.css";

export const Cli: React.FC<{
  url: string;
  token: string;
}> = (props) => {
  return (
    <RedisCli
      {...props}
      welcome={
        <div>
          <span>Hello</span>
          <span>World</span>
        </div>
      }
    />
  );
};
