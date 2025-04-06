#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import fs from "node:fs";
import path from "node:path";
import url from "node:url";

import ky from "ky";

const packageJson = JSON.parse(
  fs.readFileSync(path.join(path.dirname(url.fileURLToPath(import.meta.url)), '..', 'package.json'), 'utf8'),
);

const API_BASE = process.env.CLOUDAUTOMATOR_API_URL || "https://manager.cloudautomator.com/api/v1";
const API_KEY = process.env.CLOUDAUTOMATOR_API_KEY;

if (!API_BASE) {
  console.error("CLOUDAUTOMATOR_API_URL environment variable is not set");
  process.exit(1);
}
if (!API_KEY) {
  console.error("CLOUDAUTOMATOR_API_KEY environment variable is not set");
  process.exit(1);
}

const server = new McpServer({
  name: "mcp-server-cloudautomator",
  version: packageJson.version,
  capabilities: {
    resources: {},
    tools: {},
  },
});

const api = ky.create({
  prefixUrl: API_BASE,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
});

const getResponse = async (resource: string, id: number): Promise<string> => {
  return await api.get(`${resource}/${id}`).text(); // don't parse body as json
};

server.tool(
  "get-job",
  "Get a job details from Cloud Automator",
  { jobId: z.number() },
  async ({ jobId }) => {
    try {
      return {
        content: [{
          type: 'text',
          text: await getResponse("jobs", jobId),
        }],
        isError: false,
      };
    } catch (error) {
      console.error("Fetch error: ", error);
      return {
        content: [{
          type: 'text',
          text: `Couldn't get a job. jobId=${jobId}`,
        }],
        isError: true,
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Cloud Automator MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
