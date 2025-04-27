export function createCORSHeaders() {
    return {
      "Access-Control-Allow-Origin": "*",  // Adjust this to your allowed origin
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400", // Cache the preflight response for 24 hours
    };
  }
  
  export function handleOptionsRequest() {
    return new Response(null, {
      status: 204, // No Content
      headers: createCORSHeaders(),
    });
  }
  