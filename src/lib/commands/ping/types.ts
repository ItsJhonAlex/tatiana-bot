export interface PingResult {
  latency: number;
  apiLatency: number;
  timestamp: number;
}

export interface PingOptions {
  ephemeral?: boolean;
}
