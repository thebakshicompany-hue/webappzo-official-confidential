import { clientSideEnv } from "@/lib/env/client-side";
import pb from "@/lib/pocketbase";
import Client, { Environment, Local, PreviewEnv } from "./encore-client";

// Get the correct encore environment
let environment = Local;
if (clientSideEnv.NEXT_PUBLIC_VERCEL_ENV === "production") {
	environment = Environment("staging");
} else if (clientSideEnv.NEXT_PUBLIC_VERCEL_ENV === "preview") {
	if (!clientSideEnv.NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID) {
		throw new Error("NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID is not set");
	}
	environment = PreviewEnv(
		clientSideEnv.NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID,
	);
}

/**
 * Get an authenticated encore API client.
 *
 * Meant to be used to use on the client side.
 */
export function useApiClient() {
	return new Client(environment, {
		auth: async () => {
			const token = pb.authStore.token;
			return {
				authorization: token ? `Bearer ${token}` : "",
			};
		},
	});
}
