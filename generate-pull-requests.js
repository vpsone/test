const axios = require('axios');
const fs = require('fs');

async function fetchPullRequests() {
  const token = process.env.GH_TOKEN;
  const headers = {
    Authorization: `token ${token}`,
  };

  const response = await axios.get(
    'https://api.github.com/graphql',
    {
      headers,
      data: {
        query: `
          {
            viewer {
              pullRequests(last: 5) {
                nodes {
                  title
                  url
                }
              }
            }
          }
        `,
      },
    }
  );

  const pullRequests = response.data.data.viewer.pullRequests.nodes;
  return pullRequests;
}

async function generatePullRequestsMarkdown() {
  const pullRequests = await fetchPullRequests();
  const markdown = pullRequests.map((pr) => `- [${pr.title}](${pr.url})`).join('\n');
  fs.writeFileSync('pull-requests.md', markdown);
}

generatePullRequestsMarkdown();
