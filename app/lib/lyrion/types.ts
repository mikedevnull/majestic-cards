/**
 * JSON-RPC request/response types for Lyrion Media Server API
 * Based on: https://lyrion.org/reference/cli/using-the-cli/#jsonrpcjs
 */

/**
 * JSON-RPC 1.0 request format
 */
export interface JsonRpcRequest {
  id: string | number;
  method: "slim.request";
  params: [playerId: string, command: string[]];
}

/**
 * Error response from the API
 */
export interface LyrionError extends Error {
  code?: string;
  statusCode?: number;
}

/**
 * Client configuration options
 */
export interface LyrionClientConfig {
  baseUrl: string;
  timeout?: number;
}
