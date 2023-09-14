const fs = require('fs');
const fetch = require('node-fetch'); 
const token = process.env.GH_TOKEN;
const url = 'https://api.github.com/graphql';

fetch(url, {
  method: 'POST',
  headers: {
    'Authorization': `bearer ${token}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: '  {    "query": "query { viewer { pullRequests(last: 50){ nodes { title url }} }}"  } '
})
  .then(response => response.json())
  .then(data => {
    const pullRequest = data.data.viewer.pullRequests.nodes;
    const markdown = pullRequest.map((pr) => `- [${pr.title}](${pr.url})`).join('\n');
    fs.writeFileSync('pull-requests.md', markdown);
  })
  .catch(error => console.error('Error:', error));
