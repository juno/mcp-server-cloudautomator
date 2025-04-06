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

const listResources = async (resource: string, pageNumber: number, pageSize: number): Promise<string> => {
  return await api.get(`${resource}?page%5Bnumber%5D=${pageNumber}&page%5Bsize%5D=${pageSize}`).text(); // don't parse body as json
};

const listNestedResources = async (parentResource: string, parentId: number, resource: string, pageNumber: number, pageSize: number): Promise<string> => {
  return await api.get(`${parentResource}/${parentId}/${resource}?page%5Bnumber%5D=${pageNumber}&page%5Bsize%5D=${pageSize}`).text(); // don't parse body as json
};

const getResource = async (resource: string, id: number): Promise<string> => {
  return await api.get(`${resource}/${id}`).text(); // don't parse body as json
};

const getNestedResource = async (parentResource: string, parentId: number, resource: string, id?: number): Promise<string> => {
  const urlPath = id !== undefined ? `${parentResource}/${parentId}/${resource}/${id}` : `${parentResource}/${parentId}/${resource}`;
  return await api.get(urlPath).text(); // don't parse body as json
};

server.tool(
  "list-jobs",
  "List all jobs with pagination. ジョブの一覧を取得（ページネーションあり）。",
  {
    pageNumber: z.number(),
    pageSize: z.number()
  },
  async ({ pageNumber = 1, pageSize = 10 }) => {
    try {
      return {
        content: [{
          type: 'text',
          text: await listResources("jobs", pageNumber, pageSize),
        }],
        isError: false,
      };
    } catch (error) {
      console.error("Fetch error: ", error);
      return {
        content: [{
          type: 'text',
          text: `Couldn't list jobs. pageNumber=${pageNumber} pageSize=${pageSize}`,
        }],
        isError: true,
      };
    }
  }
);

server.tool(
  "get-job",
  "Get a job with a specific ID. 指定されたIDのジョブを取得。",
  { jobId: z.number() },
  async ({ jobId }) => {
    try {
      return {
        content: [{
          type: 'text',
          text: await getResource("jobs", jobId),
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

server.tool(
  "get-log",
  "Get a job log with a specific ID. 指定されたIDのジョブログを取得。",
  { logId: z.number() },
  async ({ logId }) => {
    try {
      return {
        content: [{
          type: 'text',
          text: await getResource("logs", logId),
        }],
        isError: false,
      };
    } catch (error) {
      console.error("Fetch error: ", error);
      return {
        content: [{
          type: 'text',
          text: `Couldn't get a log. logId=${logId}`,
        }],
        isError: true,
      };
    }
  }
);

server.tool(
  "get-resource-operation-results",
  "Get resource operation results which belongs to the job log with a specific ID. 指定されたIDのジョブログのリソース操作結果を取得。",
  { logId: z.number() },
  async ({ logId }) => {
    try {
      return {
        content: [{
          type: 'text',
          text: await getNestedResource("logs", logId, "resource_operation_results"),
        }],
        isError: false,
      };
    } catch (error) {
      console.error("Fetch error: ", error);
      return {
        content: [{
          type: 'text',
          text: `Couldn't get a resource operation results. logId=${logId}`,
        }],
        isError: true,
      };
    }
  }
);

server.tool(
  "list-job-workflows",
  "List all job workflows with pagination. ジョブワークフローの一覧を取得（ページネーションあり）。",
  {
    pageNumber: z.number(),
    pageSize: z.number()
  },
  async ({ pageNumber = 1, pageSize = 10 }) => {
    try {
      return {
        content: [{
          type: 'text',
          text: await listResources("job_workflows", pageNumber, pageSize),
        }],
        isError: false,
      };
    } catch (error) {
      console.error("Fetch error: ", error);
      return {
        content: [{
          type: 'text',
          text: `Couldn't list job workflows. pageNumber=${pageNumber} pageSize=${pageSize}`,
        }],
        isError: true,
      };
    }
  }
);

server.tool(
  "get-job-workflow",
  "Get a job workflow with a specific ID. 指定されたIDのジョブワークフローを取得。",
  { jobWorkflowId: z.number() },
  async ({ jobWorkflowId }) => {
    try {
      return {
        content: [{
          type: 'text',
          text: await getResource("job_workflows", jobWorkflowId),
        }],
        isError: false,
      };
    } catch (error) {
      console.error("Fetch error: ", error);
      return {
        content: [{
          type: 'text',
          text: `Couldn't get a job workflow. jobWorkflowId=${jobWorkflowId}`,
        }],
        isError: true,
      };
    }
  }
);

server.tool(
  "list-post-processes",
  "List all post processes with pagination. 後処理の一覧を取得（ページネーションあり）。",
  {
    pageNumber: z.number(),
    pageSize: z.number()
  },
  async ({ pageNumber = 1, pageSize = 10 }) => {
    try {
      return {
        content: [{
          type: 'text',
          text: await listResources("post_processes", pageNumber, pageSize),
        }],
        isError: false,
      };
    } catch (error) {
      console.error("Fetch error: ", error);
      return {
        content: [{
          type: 'text',
          text: `Couldn't list post processes. pageNumber=${pageNumber} pageSize=${pageSize}`,
        }],
        isError: true,
      };
    }
  }
);

server.tool(
  "get-post-process",
  "Get a post process with a specific ID. 指定されたIDの後処理を取得。",
  { postProcessId: z.number() },
  async ({ postProcessId }) => {
    try {
      return {
        content: [{
          type: 'text',
          text: await getResource("post_processes", postProcessId),
        }],
        isError: false,
      };
    } catch (error) {
      console.error("Fetch error: ", error);
      return {
        content: [{
          type: 'text',
          text: `Couldn't get a post process. postProcessId=${postProcessId}`,
        }],
        isError: true,
      };
    }
  }
);

server.tool(
  "list-group-aws-accounts",
  "List all AWS accounts with pagination. グループに属するAWSアカウントの一覧を取得（ページネーションあり）。",
  {
    groupId: z.number(),
    pageNumber: z.number(),
    pageSize: z.number()
  },
  async ({ groupId, pageNumber = 1, pageSize = 10 }) => {
    try {
      return {
        content: [{
          type: 'text',
          text: await listNestedResources("groups", groupId, "aws_accounts", pageNumber, pageSize),
        }],
        isError: false,
      };
    } catch (error) {
      console.error("Fetch error: ", error);
      return {
        content: [{
          type: 'text',
          text: `Couldn't list AWS accounts. groupId=${groupId} pageNumber=${pageNumber} pageSize=${pageSize}`,
        }],
        isError: true,
      };
    }
  }
);

server.tool(
  "get-group-aws-account",
  "Get an AWS account which belongs to the group with a specific ID. グループに属する指定されたIDのAWSアカウントを取得。",
  {
    groupId: z.number(),
    awsAccountId: z.number()
  },
  async ({ groupId, awsAccountId }) => {
    try {
      return {
        content: [{
          type: 'text',
          text: await getNestedResource("groups", groupId, "aws_accounts", awsAccountId),
        }],
        isError: false,
      };
    } catch (error) {
      console.error("Fetch error: ", error);
      return {
        content: [{
          type: 'text',
          text: `Couldn't get an AWS account. groupId=${groupId} awsAccountId=${awsAccountId}`,
        }],
        isError: true,
      };
    }
  }
);

server.tool(
  "list-group-google-cloud-accounts",
  "List all Google Cloud accounts with pagination. グループに属するGoogle Cloudアカウントの一覧を取得（ページネーションあり）。",
  {
    groupId: z.number(),
    pageNumber: z.number(),
    pageSize: z.number()
  },
  async ({ groupId, pageNumber = 1, pageSize = 10 }) => {
    try {
      return {
        content: [{
          type: 'text',
          text: await listNestedResources("groups", groupId, "google_cloud_accounts", pageNumber, pageSize),
        }],
        isError: false,
      };
    } catch (error) {
      console.error("Fetch error: ", error);
      return {
        content: [{
          type: 'text',
          text: `Couldn't list Google Cloud accounts. groupId=${groupId} pageNumber=${pageNumber} pageSize=${pageSize}`,
        }],
        isError: true,
      };
    }
  }
);

server.tool(
  "get-group-google-cloud-account",
  "Get a Google Cloud account which belongs to the group with a specific ID. グループに属する指定されたIDのGoogle Cloudアカウントを取得。",
  {
    groupId: z.number(),
    googleCloudAccountId: z.number()
  },
  async ({ groupId, googleCloudAccountId }) => {
    try {
      return {
        content: [{
          type: 'text',
          text: await getNestedResource("groups", groupId, "google_cloud_accounts", googleCloudAccountId),
        }],
        isError: false,
      };
    } catch (error) {
      console.error("Fetch error: ", error);
      return {
        content: [{
          type: 'text',
          text: `Couldn't get a Google Cloud account. groupId=${groupId} googleCloudAccountId=${googleCloudAccountId}`,
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
