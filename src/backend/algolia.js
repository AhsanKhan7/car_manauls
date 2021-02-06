const myQuery = `{
  allSitePage(filter: {path: {regex: "/^((?!page).)*$/"}}) {
    edges {
      node {
        objectID: id
        path
        context {
          manual {
            model
            make
            year
          }
        }
      }
    }
  }
}`;

const queries = [
    {
        query: myQuery,
        transformer: ({ data }) => data.allSitePage.edges.filter(edge => edge.node.context.manual || edge.node.context.entry).map(({ node }) => node), // optional
        // indexName: 'index name to target', // overrides main index name, optional
        settings: {
            // optional, any index settings
        },
    },
];

module.exports = queries;