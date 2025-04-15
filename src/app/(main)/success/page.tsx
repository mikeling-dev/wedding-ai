import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { cookies } from "next/headers";
import { stripe } from "../../../lib/stripe";

async function updateSubscription(sessionId: string) {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const response = await fetch(
    `${protocol}://${host}/api/update-subscription`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      body: JSON.stringify({ sessionId }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Failed to update subscription: ${data.error}${
        data.email ? ` (email: ${data.email})` : ""
      }`
    );
  }

  return data;
}

export default async function Success({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  if (!params?.session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)");
  }

  const session_id = Array.isArray(params.session_id)
    ? params.session_id[0]
    : params.session_id;

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  if (session.status === "open") {
    return redirect("/");
  }

  if (session.status === "complete") {
    if (!session.customer_details?.email) {
      throw new Error("No customer email found");
    }

    // Update subscription
    await updateSubscription(session_id);

    return (
      <section id="success" className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-6">Thank You!</h1>
        <p className="mb-4">
          Your account has been upgraded to Premium! You now have access to all
          premium features.
        </p>
        <p>
          If you have any questions, please email{" "}
          <a
            href="mailto:mikeling.dev@gmail.com"
            className="text-blue-600 hover:underline"
          >
            mikeling.dev@gmail.com
          </a>
        </p>
      </section>
    );
  }
}
