import type { Redis } from "@upstash/redis";
import {
  type ContentValue,
  DATA_PER_PAGE,
  INITIAL_CURSOR,
  toJsonStringifiable,
  transformArray,
  transformHash,
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

    const res = await redis.scan


    const content = await redis.get<string>(key);
    return { content, type: "string", memory: roughSizeOfObject(content) } satisfies {
      content: string | null;
      type: "string";
      memory: number;
    };
  },
  zset: async ({ key, redis, cursor, index, cursorStack }: FetchDataParams) => {
    const [nextCursorStr, zrangeValue] = await redis.zscan(key, cursor as number, {
      count: DATA_PER_PAGE,
    });
    if (index === cursorStack.current.length - 1) {
      cursorStack.current.push(Number(nextCursorStr));
    }
    const content = transformArray(zrangeValue);
    return { content, type: "zset", memory: roughSizeOfObject(content) } satisfies {
      content: ContentValue[];
      type: "zset";
      memory: number;
    };
  },
  hash: async ({ key, redis, cursor, index, cursorStack }: FetchDataParams) => {
    const [nextCursorStr, hashValues] = await redis.lget(key, cursor as number, {
      count: DATA_PER_PAGE,
    });
    if (index === cursorStack.current.length - 1) {
      cursorStack.current.push(Number(nextCursorStr));
    }
    const content = transformHash(hashValues);
    return { content, type: "hash", memory: roughSizeOfObject(content) } satisfies {
      content: ContentValue[];
      type: "hash";
      memory: number;
    };
  },
  set: async ({ key, redis, cursor, index, cursorStack }: FetchDataParams) => {
    const [nextCursorStr, setValues] = await redis.sscan(key, cursor as number, {
      count: DATA_PER_PAGE,
    });
    if (index === cursorStack.current.length - 1) {
      cursorStack.current.push(Number(nextCursorStr));
    }
    const content = setValues.map((item, _) => ({
      value: null,
      content: toJsonStringifiable(item, 0),
    }));

    return {
      content,
      memory: roughSizeOfObject(content),
      type: "set",
    } satisfies { content: ContentValue[]; type: "set"; memory: number };
  },
  list: async ({ key, redis, index, listLength }: FetchDataParams) => {
    if (listLength && listLength.current === INITIAL_CURSOR) {
      listLength.current = await redis.llen(key);
    }
    const start = index * DATA_PER_PAGE;
    const end = (index + 1) * DATA_PER_PAGE - 1;
    const list = await redis.lrange(key, start, end);
    const content = list.map((item, idx) => {
      const overallIdx = start + idx;
      return { value: overallIdx, content: toJsonStringifiable(item, 0) };
    });

    return {
      content,
      type: "list",
      memory: roughSizeOfObject(content),
    } satisfies { content: ContentValue[]; type: "list"; memory: number };
  },
  stream: async ({ key, redis, cursor, index, cursorStack }: FetchDataParams) => {
    const typedCursor = cursor as string | typeof INITIAL_CURSOR;
    const result = await redis.xrange(key, typedCursor === INITIAL_CURSOR ? "-" : typedCursor, "+", DATA_PER_PAGE);

    const transformedData = transformStream(result);
    //Last items timestamp is being used as next cursor
    const nextCursor = transformedData.at(-1)?.value;
    if (index === cursorStack.current.length - 1) {
      cursorStack.current.push(transformedData.length === DATA_PER_PAGE && nextCursor ? nextCursor : INITIAL_CURSOR);
    }

    return { content: transformedData, type: "stream", memory: roughSizeOfObject(transformedData) } satisfies {
      content: ContentValue[];
      type: "stream";
      memory: number;
    };
  },
  json: async ({ key, redis }: FetchDataParams) => {
    const result = (await redis.json.get(key)) as string | null;

    return { content: result, type: "json", memory: roughSizeOfObject(result) } satisfies {
      content: string | null;
      type: "json";
      memory: number;
    };
  },
};

const roughSizeOfObject = (obj: unknown) => {
  let str = null;
  if (typeof obj === "string") {
    // If obj is a string, then use it
    str = obj;
  } else {
    // Else, make obj into a string
    str = JSON.stringify(obj);
  }
  // Get the length of the Uint8Array
  const bytes = new TextEncoder().encode(str).length;
  return bytes;
};
