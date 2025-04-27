import { redirect } from "@remix-run/node";
import { authenticate } from "../../shopify.server";
import prisma from "../../db.server";

export async function action({ request }) {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const programStatus = formData.get("programStatus");
  if (!session.id || programStatus === null) {
    throw new Error("Invalid session ID or programStatus");
  }

  await prisma.session.update({
    where: {
      id: session.id,
    },
    data: {
      programStatus: programStatus === "true" ? true : false,
    },
  });

  return redirect("/app/settings");
}
