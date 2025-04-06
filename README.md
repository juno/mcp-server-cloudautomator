# A Cloud Automator MCP server

An unofficial MCP server for using [Cloud Automator](https://cloudautomator.com/) REST API.

## Features

### Tools

1. `list-jobs`
  - List all jobs with pagination
  - Inputs:
    - `pageNumber` (number); Page number for pagination (default: 1)
    - `pageSize` (number); Number of jobs to return (default: 10)
2. `get-job`
  - Get a job with a specific ID
  - Inputs:
    - `jobId` (number); Job ID
3. `get-log`
  - Get a job log with a specific ID
  - Inputs:
    - `logId` (number); Log ID
4. `get-resource-operation-results`
  - Get resource operation results which belongs to the job log with a specific ID
  - Inputs:
    - `logId` (number); Log ID
5. `list-job-workflows`
  - List all job workflows with pagination
  - Inputs:
    - `pageNumber` (number); Page number for pagination (default: 1)
    - `pageSize` (number); Number of jobs to return (default: 10)
6. `get-job-workflow`
  - Get a job workflow with a specific ID
  - Inputs:
    - `jobWorkflowId` (number); Job ID
7. `list-post-processes`
  - List all post processes with pagination
  - Inputs:
    - `pageNumber` (number); Page number for pagination (default: 1)
    - `pageSize` (number); Number of jobs to return (default: 10)
8. `get-post-process`
  - Get a post process with a specific ID
  - Inputs:
    - `postProcessId` (number); Post Process ID
9. `list-group-aws-accounts`
  - List all AWS accounts which belongs to the group with a specific ID, with pagination
  - Inputs:
    - `groupId` (number); Group ID
    - `pageNumber` (number); Page number for pagination (default: 1)
    - `pageSize` (number); Number of jobs to return (default: 10)
10. `get-group-aws-account`
  - Get an AWS account which belongs to the group with a specific ID
  - Inputs:
    - `groupId` (number); Group ID
    - `awsAccountId` (number); AWS account ID
11. `list-group-google-cloud-accounts`
  - List all Google Cloud accounts which belongs to the group with a specific ID, with pagination
  - Inputs:
    - `groupId` (number); Group ID
    - `pageNumber` (number); Page number for pagination (default: 1)
    - `pageSize` (number); Number of jobs to return (default: 10)
12. `get-group-google-cloud-account`
  - Get an Google Cloud account which belongs to the group with a specific ID
  - Inputs:
    - `groupId` (number); Group ID
    - `googleCloudAccountId` (number); Google Cloud account ID

## Prerequisites

1. Install [Node.js](https://nodejs.org/en/download/)
2. Create a Cloud Automator API key. To learn more about access tokens, please check out [the documentation](https://support.serverworks.co.jp/hc/ja/articles/6051827207193).

## Installation

### Clone the repository

```bash
$ git clone https://github.com/juno/mcp-server-cloudautomator.git
```

### Build the project

```bash
$ cd mcp-server-cloudautomator
$ npm install
$ npm run build
```

### Usage with Cline or Claude Desktop

```json
{
  "mcpServers": {
    "cloudautomator": {
      "command": "node",
      "args": [
        "/path/to/mcp-server-cloudautomator/dist/index.js"
      ],
      "env": {
        "CLOUDAUTOMATOR_API_KEY": "<YOUR_API_KEY>"
      }
    }
  }
}
```

## Environment Variables

- `CLOUDAUTOMATOR_API_KEY`: Your Cloud Automator API key (required)
- `CLOUDAUTOMATOR_API_URL`: The base URL for the Cloud Automator API. Default is `https://api.cloudautomator.com/v1/`

## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License. For more details, please see the LICENSE file in the project repository.
