import type { LyrionClientConfig, JsonRpcRequest, LyrionError } from "./types";
import {
  JsonRpcResponse,
  JsonRpcResponseSchema,
  MuteResponse,
  MuteResponseSchema,
  PlayerInfo,
  PlayerListResponse,
} from "./schemas";

/**
 * Lyrion Media Server JSON-RPC client
 *
 * Communicates with Lyrion Music Server via the JSON-RPC API over HTTP.
 * Reference: https://lyrion.org/reference/cli/using-the-cli/#jsonrpcjs
 */
export class LyrionClient {
  private baseUrl: string;
  private timeout: number;
  private requestId: number = 0;

  constructor(config: LyrionClientConfig) {
    if (!config.baseUrl) {
      throw new Error("baseUrl is required in LyrionClient config");
    }

    // Remove trailing slash to avoid double slashes
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.timeout = config.timeout ?? 10000;
  }

  /**
   * Generic request method for any slim.request command
   */
  async request(playerId: string, command: string[]): Promise<JsonRpcResponse> {
    const requestPayload: JsonRpcRequest = {
      id: this.getNextRequestId(),
      method: "slim.request",
      params: [playerId, command],
    };

    try {
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}/jsonrpc.js`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestPayload),
        },
      );

      return JsonRpcResponseSchema.parse(response);
    } catch (error) {
      throw this.createError(error, requestPayload);
    }
  }

  async getPlayers(): Promise<PlayerInfo[]> {
    const command = ["players", "0", "100"];
    const response = await this.request("", command);
    return PlayerListResponse.parse(response.result).players_loop;
  }

  /**
   * Mute or unmute a player
   * @param playerId - Player ID
   * @param mute - true to mute, false to unmute, undefined to toggle
   */
  async setMute(playerId: string, mute?: boolean): Promise<MuteResponse> {
    const command = ["mixer", "muting"];

    if (mute === undefined) {
      // Toggle
      command.push("toggle");
    } else {
      command.push(mute ? "1" : "0");
    }

    const response = await this.request(playerId, command);
    return MuteResponseSchema.parse(response.result);
  }

  /**
   * Query mute status of a player
   */
  async getMute(playerId: string): Promise<MuteResponse> {
    const command = ["mixer", "muting", "?"];
    const response = await this.request(playerId, command);
    return MuteResponseSchema.parse(response.result);
  }

  /**
   * Fetch with timeout support
   */
  private fetchWithTimeout(
    url: string,
    options: RequestInit,
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Request timeout after ${this.timeout}ms`));
      }, this.timeout);

      fetch(url, options)
        .then(async (response) => {
          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();
          if (data && typeof data === "object") {
            // Some responses might not have explicit result field
            resolve(data);
          } else {
            reject(new Error("Invalid response format from server"));
          }
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }

  /**
   * Generate next request ID
   */
  private getNextRequestId(): number {
    return ++this.requestId;
  }

  /**
   * Create a typed error from various error sources
   */
  private createError(error: unknown, request: JsonRpcRequest): LyrionError {
    const lyrionError: LyrionError = new Error(
      `Failed to execute command: ${request.params[1].join(" ")}`,
    );

    if (error instanceof Error) {
      lyrionError.message = error.message;
      lyrionError.cause = error;
    } else if (typeof error === "string") {
      lyrionError.message = error;
    }

    return lyrionError;
  }
}

export default LyrionClient;
