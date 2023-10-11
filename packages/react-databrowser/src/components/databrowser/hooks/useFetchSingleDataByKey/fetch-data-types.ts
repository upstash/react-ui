import type { Redis } from "@upstash/redis";
import {
  ContentValue,
  DATA_PER_PAGE,
  INITIAL_CURSOR_NUM,
  toJsonStringifiable,
  transformArray,
  transformStream,
} from "./utils";

type FetchDataParams = {
  key: string;
  redis: Redis;
  cursor: number | string;
  index: number;
  cursorStack: React.MutableRefObject<(string | number)[]>;
  listLength?: React.MutableRefObject<number>;
};

export const fetchDataOfType = {
  string: async ({ key, redis }: FetchDataParams) => {
    const content = await redis.get<string>(key);
    return { content, type: "string" } satisfies { content: string | null; type: "string" };
  },
  zset: async ({ key, redis, cursor, index, cursorStack }: FetchDataParams) => {
    const [nextCursor, zrangeValue] = await redis.zscan(key, cursor as number, {
      count: DATA_PER_PAGE,
    });
    if (index === cursorStack.current.length - 1) {
      cursorStack.current.push(nextCursor);
    }
    return { content: transformArray(zrangeValue), type: "zset" } satisfies { content: ContentValue[]; type: "zset" };
  },
  hash: async ({ key, redis, cursor, index, cursorStack }: FetchDataParams) => {
    const [nextCursor, hashValues] = await redis.hscan(key, cursor as number, {
      count: DATA_PER_PAGE,
    });
    if (index === cursorStack.current.length - 1) {
      cursorStack.current.push(nextCursor);
    }
    return { content: transformArray(hashValues), type: "hash" } satisfies { content: ContentValue[]; type: "hash" };
  },
  set: async ({ key, redis, cursor, index, cursorStack }: FetchDataParams) => {
    const [nextCursor, setValues] = await redis.sscan(key, cursor as number, {
      count: DATA_PER_PAGE,
    });
    if (index === cursorStack.current.length - 1) {
      cursorStack.current.push(nextCursor);
    }
    return {
      content: setValues.map((item, _) => ({
        value: null,
        content: toJsonStringifiable(item, 0),
      })),
      type: "set",
    } satisfies { content: ContentValue[]; type: "set" };
  },
  list: async ({ key, redis, index, listLength }: FetchDataParams) => {
    if (listLength && listLength.current === INITIAL_CURSOR_NUM) {
      listLength.current = await redis.llen(key);
    }
    const start = index * DATA_PER_PAGE;
    const end = (index + 1) * DATA_PER_PAGE - 1;
    const list = await redis.lrange(key, start, end);
    return {
      content: list.map((item, idx) => {
        const overallIdx = start + idx + 1;
        const displayIdx = String(overallIdx).padStart(2, "0"); // '01', '02', ..., '50'
        return { value: displayIdx, content: toJsonStringifiable(item, 0) };
      }),
      type: "list",
    } satisfies { content: ContentValue[]; type: "list" };
  },
  stream: async ({ key, redis, cursor, index, cursorStack }: FetchDataParams) => {
    const typedCursor = cursor as string | typeof INITIAL_CURSOR_NUM;
    const result = await redis.xrange(key, typedCursor === INITIAL_CURSOR_NUM ? "-" : typedCursor, "+", DATA_PER_PAGE);

    const transformedData = transformStream(result);
    //Last items timestamp is being used as next cursor
    const nextCursor = transformedData.at(-1)?.value;
    if (index === cursorStack.current.length - 1) {
      cursorStack.current.push(
        transformedData.length === DATA_PER_PAGE && nextCursor ? nextCursor : INITIAL_CURSOR_NUM,
      );
    }

    return { content: transformedData, type: "stream" } satisfies { content: ContentValue[]; type: "stream" };
  },
  json: async ({ key, redis }: FetchDataParams) => {
    const result = await redis.eval("return redis.call('JSON.GET', KEYS[1])", [key], []);
    return { content: result as string, type: "json" } satisfies { content: string; type: "json" };
  },
};
