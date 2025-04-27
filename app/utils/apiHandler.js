import { json } from "@remix-run/node";
import { createCORSHeaders, handleOptionsRequest } from "./cors";

export async function handleAPI(request, callback) {
    if (request.method === "OPTIONS") {
        return handleOptionsRequest();
    }

    try {
        const data = await request.json(); // Parse JSON request body
        const response = await callback(data); // Execute the provided callback function

        return json(response, { headers: createCORSHeaders() });
    } catch (error) {
        return json({ error: "Invalid JSON" }, { status: 400, headers: createCORSHeaders() });
    }
}
