import { authenticate } from "../../shopify.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const url = new URL(request.url);
  const afterCursor = url.searchParams.get("after");

  const response = await admin.graphql(
    `#graphql
    query getProducts($first: Int!, $after: String, $query: String) {
      products(first: $first, after: $after, query: $query) {
        edges {
          node {
            id
            title
            handle
            media(first: 1, reverse: true) {
              edges {
                node {
                  ... on MediaImage {
                    image {
                      url
                      altText
                    }
                  }
                }
              }
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
        first: 5,
        after: afterCursor || null,
        query: url.searchParams.get("search") || null,
      },
    },
  );

  const data = await response.json();

  return {
    products: data.data.products.edges.map(({ node }) => ({
      ...node,
      imageSrc:
        node.media.edges[0]?.node.image?.url ||
        "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-1_small.png",
      imageAlt:
        node.media.edges[0]?.node.image?.altText || "Product image",
    })),
    nextCursor: data.data?.products?.pageInfo?.endCursor,
    hasNextPage: data.data?.products?.pageInfo?.hasNextPage,
    backCursor: data.data?.products?.pageInfo?.startCursor,
    hasPreviousPage: data.data?.products?.pageInfo?.hasPreviousPage,
  };
};