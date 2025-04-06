# A Cloud Automator MCP server

An unofficial MCP server for using [Cloud Automator](https://cloudautomator.com/) REST API.

## Features

### Tools

1. `get-job`
  - Get a job with a specific job ID
  - Inputs:
    - `jobId` (number); Job ID

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
