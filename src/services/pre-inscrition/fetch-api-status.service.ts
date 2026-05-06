import {  examApi} from "@/lib/exam-api";

export interface ApiStatusResponse {
  application: {
    name: string;
    version: string;
    environment: string;
    timestamp: string;
  };
  server: {
    nodeVersion: string;
    platform: string;
    hostname: string;
    uptime: string;
    memory: {
      total: string;
      free: string;
      usage: string;
    };
  };
  network: {
    interfaces: Record<
      string,
      {
        address: string;
        family: string;
        internal: boolean;
      }[]
    >;
  };
  aws: {
    region: string;
  };
  request: {
    clientIp: string;
    userAgent: string;
    timestamp: string;
    path: string;
  };
}

export async function fetchApiStatus(): Promise<ApiStatusResponse> {
  const data = await examApi.get("").json<ApiStatusResponse>();
  return data;
}