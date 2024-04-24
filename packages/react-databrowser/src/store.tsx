import { type PropsWithChildren, createContext, useContext, useMemo } from "react";
import type { Redis } from "@upstash/redis";
import { redisClient } from "./lib/clients";

export type DatabrowserProps = {
  url?: string;
  token?: string;
};

type DatabrowserContextProps = {
  redis: Redis;
};

const DatabrowserContext = createContext<DatabrowserContextProps | undefined>(undefined);

interface DatabrowserProviderProps {
  databrowser: DatabrowserProps;
}

export const DatabrowserProvider = ({ children, databrowser }: PropsWithChildren<DatabrowserProviderProps>) => {
  const redisInstances = useMemo(() => redisClient(databrowser), [databrowser.token, databrowser.url]);
  return <DatabrowserContext.Provider value={{ redis: redisInstances }}>{children}</DatabrowserContext.Provider>;
};

export const useDatabrowser = (): DatabrowserContextProps => {
  const context = useContext(DatabrowserContext);
  if (!context) {
    throw new Error("useDatabrowser must be used within a DatabrowserProvider");
  }
  return context;
};
