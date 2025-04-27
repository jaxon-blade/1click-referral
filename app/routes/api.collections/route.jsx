import { json } from "@remix-run/node";
import { authenticate } from "../../shopify.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const url = new URL(request.url);
  const afterCursor = url.searchParams.get("after");

  const response = await admin.graphql(
    `#graphql
        query getCollections($first: Int!, $after: String,$query: String) {
          collections(first: $first, after: $after, query: $query) {
            edges {
              node {
                id
                title
                handle
                image {
                  originalSrc
                  altText
                }
              }
              cursor
            }
            pageInfo {
              hasNextPage
              endCursor
              startCursor
              hasPreviousPage
            }
          }
        }`,
    {
      variables: {
        first: 10,
        after: afterCursor || null,
        query: url.searchParams.get("search") || null,

      }
    }
  );

  const data = await response.json();
  return json({
    collections: data.data.collections.edges.map(({ node }) => ({
      ...node,
      imageSrc: node.image?.originalSrc || 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-collection-1_small.png',
      imageAlt: node.image?.altText || 'Collection image'
    })),
    nextCursor: data.data?.collections?.pageInfo?.endCursor,
    hasNextPage: data.data?.collections?.pageInfo?.hasNextPage,
    backCursor: data.data?.collections?.pageInfo?.startCursor,
    hasPreviousPage: data.data?.collections?.pageInfo?.hasPreviousPage,
  });
};
