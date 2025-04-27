import { authenticate } from "../../shopify.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
      query GetCheckoutProfiles {
  checkoutProfiles(first: 1, query: "is_published:true") {
    edges {
      node {
        id
        name
      }
    }
  }
}`,
    {},
  );

  const data = await response.json();
  return data.data.checkoutProfiles.edges.map((edge) => edge.node.id.replace("gid://shopify/CheckoutProfile/",""));
};
