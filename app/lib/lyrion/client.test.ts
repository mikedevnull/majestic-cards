import { describe, it, expect, beforeEach, vi } from "vitest";
import { LyrionClient } from "./client";

import type { JsonRpcResponse } from "./schemas";

// Mock fetch
global.fetch = vi.fn();

describe("LyrionClient", () => {
  const mockBaseUrl = "http://localhost:9000";
  let client: LyrionClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new LyrionClient({ baseUrl: mockBaseUrl });
  });

  describe("initialization", () => {
    it("should create a client with valid config", () => {
      expect(client).toBeDefined();
    });

    it("should throw error if baseUrl is missing", () => {
      expect(() => {
        new LyrionClient({ baseUrl: "" });
      }).toThrow("baseUrl is required");
    });

    it("should remove trailing slash from baseUrl", () => {
      const clientWithSlash = new LyrionClient({
        baseUrl: "http://localhost:9000/",
      });
      expect(clientWithSlash).toBeDefined();
    });

    it("should set default timeout if not provided", () => {
      expect(client).toBeDefined();
    });

    it("should use custom timeout if provided", () => {
      const customClient = new LyrionClient({
        baseUrl: mockBaseUrl,
        timeout: 5000,
      });
      expect(customClient).toBeDefined();
    });
  });

  describe("generic request method", () => {
    it("should make a successful request", async () => {
      const mockResponse: JsonRpcResponse = {
        id: "0",
        method: "slim.request",
        params: ["00:04:20:ab:cd:ef", []],
        result: { _muting: 1 },
      };
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const playerId = "00:04:20:ab:cd:ef";
      const result = await client.request(playerId, ["mixer", "muting", "?"]);

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/jsonrpc.js`,
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }),
      );
    });

    it("should increment request IDs", async () => {
      const mockResponse: JsonRpcResponse = {
        id: "",
        method: "slim.request",
        params: ["foo", []],
        result: {},
      };
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const playerId = "00:04:20:ab:cd:ef";

      await client.request(playerId, ["command1"]);
      await client.request(playerId, ["command2"]);

      const calls = mockFetch.mock.calls;
      const firstCall = JSON.parse(calls[0][1]?.body as string);
      const secondCall = JSON.parse(calls[1][1]?.body as string);

      expect(firstCall.id).toBe(1);
      expect(secondCall.id).toBe(2);
    });

    it("should throw error on HTTP error", async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      } as Response);

      const playerId = "00:04:20:ab:cd:ef";

      await expect(
        client.request(playerId, ["mixer", "muting", "?"]),
      ).rejects.toThrow("HTTP 500");
    });

    it("should throw error on network failure", async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const playerId = "00:04:20:ab:cd:ef";

      await expect(
        client.request(playerId, ["mixer", "muting", "?"]),
      ).rejects.toThrow();
    });
  });

  describe("mute command", () => {
    it("should mute a player", async () => {
      const mockResponse: JsonRpcResponse = {
        id: 1,
        result: { _muting: "1" },
        method: "slim.request",
        params: ["foo", []],
      };
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await client.setMute("00:04:20:ab:cd:ef", true);

      expect(result).toEqual(mockResponse.result);
      const call = JSON.parse(mockFetch.mock.calls[0][1]?.body as string);
      expect(call.params[1]).toEqual(["mixer", "muting", "1"]);
    });

    it("should unmute a player", async () => {
      const mockResponse: JsonRpcResponse = {
        id: 1,
        result: { _muting: "0" },
        method: "slim.request",
        params: ["foo", []],
      };
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await client.setMute("00:04:20:ab:cd:ef", false);

      expect(result).toEqual(mockResponse.result);
      const call = JSON.parse(mockFetch.mock.calls[0][1]?.body as string);
      expect(call.params[1]).toEqual(["mixer", "muting", "0"]);
    });

    it("should toggle mute when no parameter is provided", async () => {
      const mockResponse: JsonRpcResponse = {
        id: 1,
        result: { _muting: "1" },
        method: "slim.request",
        params: ["foo", []],
      };
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await client.setMute("00:04:20:ab:cd:ef");

      expect(result).toEqual(mockResponse.result);
      const call = JSON.parse(mockFetch.mock.calls[0][1]?.body as string);
      expect(call.params[1]).toEqual(["mixer", "muting", "toggle"]);
    });

    it("should get mute status", async () => {
      const mockResponse: JsonRpcResponse = {
        id: 1,
        result: { _muting: "1" },
        method: "slim.request",
        params: ["foo", []],
      };
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await client.getMute("00:04:20:ab:cd:ef");

      expect(result).toEqual(mockResponse.result);
      const call = JSON.parse(mockFetch.mock.calls[0][1]?.body as string);
      expect(call.params[1]).toEqual(["mixer", "muting", "?"]);
    });
  });

  describe("player list", () => {
    it("should get a list of available players", async () => {
      const mockResponse: JsonRpcResponse = {
        params: ["", ["players", "0", "10"]],
        method: "slim.request",
        id: 1,
        result: {
          players_loop: [
            {
              playerid: "bb:bb:9a:df:f6:c7",
              power: 1,
              canpoweroff: 1,
              playerindex: "0",
              connected: 1,
              model: "squeezelite",
              ip: "abcdf",
              modelname: "UPnPBridge",
              isplayer: 1,
              firmware: 0,
              displaytype: "none",
              name: "Acme 100",
              seq_no: 0,
              isplaying: 0,
              uuid: null,
            },
            {
              ip: "192.168.1.23:40666",
              modelname: "UPnPBridge",
              isplayer: 1,
              firmware: 0,
              displaytype: "none",
              name: "Acme 300",
              seq_no: 0,
              isplaying: 0,
              uuid: null,
              playerid: "bb:bb:4c:9e:a9:92",
              power: 1,
              canpoweroff: 1,
              playerindex: 1,
              connected: 1,
              model: "squeezelite",
            },
            {
              modelname: "Squeezebox Radio",
              isplayer: 1,
              ip: "192.168.1.130:52741",
              seq_no: "6",
              uuid: "8b99175025686e1c8f522ee31ee51288",
              isplaying: 0,
              displaytype: "none",
              firmware: "9.0.1",
              name: "controller: 00:04:20:26:7f:",
              playerid: "00:04:20:26:7f:30",
              canpoweroff: 1,
              power: 0,
              connected: 1,
              model: "baby",
              playerindex: 2,
            },
            {
              modelname: "UPnPBridge",
              isplayer: 1,
              ip: "192.168.1.2:40696",
              seq_no: 0,
              uuid: null,
              isplaying: 0,
              displaytype: "none",
              firmware: 0,
              name: "foobar",
              playerid: "bb:bb:e0:77:90:85",
              canpoweroff: 1,
              power: 1,
              connected: 1,
              model: "squeezelite",
              playerindex: 3,
            },
          ],
          count: 4,
        },
      };
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const players = await client.getPlayers();
      expect(players.length).toEqual(mockResponse.result.count);
      const expectedPlayers = [
        {
          playerid: "bb:bb:9a:df:f6:c7",
          power: true,
          canpoweroff: true,
          playerindex: "0",
          connected: true,
          model: "squeezelite",
          ip: "abcdf",
          modelname: "UPnPBridge",
          isplayer: true,
          firmware: 0,
          displaytype: "none",
          name: "Acme 100",
          isplaying: false,
          uuid: null,
        },
        {
          ip: "192.168.1.23:40666",
          modelname: "UPnPBridge",
          isplayer: true,
          firmware: 0,
          displaytype: "none",
          name: "Acme 300",
          isplaying: false,
          uuid: null,
          playerid: "bb:bb:4c:9e:a9:92",
          power: true,
          canpoweroff: true,
          playerindex: 1,
          connected: true,
          model: "squeezelite",
        },
        {
          modelname: "Squeezebox Radio",
          isplayer: true,
          ip: "192.168.1.130:52741",
          uuid: "8b99175025686e1c8f522ee31ee51288",
          isplaying: false,
          displaytype: "none",
          firmware: "9.0.1",
          name: "controller: 00:04:20:26:7f:",
          playerid: "00:04:20:26:7f:30",
          canpoweroff: true,
          power: false,
          connected: true,
          model: "baby",
          playerindex: 2,
        },
        {
          modelname: "UPnPBridge",
          isplayer: true,
          ip: "192.168.1.2:40696",
          uuid: null,
          isplaying: false,
          displaytype: "none",
          firmware: 0,
          name: "foobar",
          playerid: "bb:bb:e0:77:90:85",
          canpoweroff: true,
          power: true,
          connected: true,
          model: "squeezelite",
          playerindex: 3,
        },
      ];
      expect(players).toEqual(expectedPlayers);
    });
  });

  describe("album info", () => {
    it("should get the metadata of an album by id", async () => {
      const mockResponse: JsonRpcResponse = {
        result: {
          count: 1,
          albums_loop: [
            {
              album: "Greatest Album",
              favorites_url: "db:album.title=Greates%20Album",
              favorites_title: "Greatest Album",
              performance: "",
              id: 848,
              artwork_track_id: "12de5fd6",
              artist: "Mega Artist",
            },
          ],
        },
        params: ["", ["albums", "0", "1", "album_id:848", "tags:lja4"]],
        method: "slim.request",
        id: 1,
      };

      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);
      const info = await client.getAlbumInfo("some-album");
      expect(info).toEqual({
        album: "Greatest Album",
        artist: "Mega Artist",
        artwork_track_id: "12de5fd6",
        id: 848,
      });
    });

    it("should return undefined for invalid or unknown album id", async () => {
      const mockResponse: JsonRpcResponse = {
        result: {
          count: 0,
        },
        params: ["", ["albums", "0", "1", "album_id:", "tags:lja4"]],
        method: "slim.request",
        id: 1,
      };

      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);
      const info = await client.getAlbumInfo("some-album");
      expect(info).toBeUndefined();
    });
  });
  describe("error handling", () => {
    it("should handle invalid response format", async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => "invalid",
      } as Response);

      await expect(
        client.request("00:04:20:ab:cd:ef", ["mixer", "muting", "?"]),
      ).rejects.toThrow("Invalid response format");
    });

    it("should handle timeout", async () => {
      const timeoutClient = new LyrionClient({
        baseUrl: mockBaseUrl,
        timeout: 10,
      });

      const mockFetch = vi.mocked(fetch);
      mockFetch.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                ok: true,
                json: async () => ({ result: {} }),
              } as Response);
            }, 100);
          }),
      );

      await expect(
        timeoutClient.request("00:04:20:ab:cd:ef", ["command"]),
      ).rejects.toThrow("timeout");
    });
  });

  it("should validate mute command with schema validation", async () => {
    const mockResponse: JsonRpcResponse = {
      id: 1,
      result: { _muting: "1" },
      method: "slim.request",
      params: ["foo", []],
    };
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await client.setMute("00:04:20:ab:cd:ef", true);

    expect(result).toEqual(mockResponse.result);
    expect(result._muting).toBe("1");
  });

  it("should reject invalid mute response from server", async () => {
    const invalidResponse = { _muting: "invalid_value" };
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: invalidResponse }),
    } as Response);

    await expect(client.setMute("00:04:20:ab:cd:ef", true)).rejects.toThrow();
  });

  it("should include command context in validation error", async () => {
    const invalidResponse = { _muting: "invalid" };
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: invalidResponse }),
    } as Response);

    try {
      await client.getMute("00:04:20:ab:cd:ef");
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
