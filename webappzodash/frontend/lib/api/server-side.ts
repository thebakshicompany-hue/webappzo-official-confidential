import { serverSideEnv } from "@/lib/env/server-side";
import Client, { Environment, Local, PreviewEnv } from "./encore-client";

// Get the correct encore environment
let environment = Local;
if (serverSideEnv.VERCEL_ENV === "production") {
	environment = Environment("staging");
} else if (serverSideEnv.VERCEL_ENV === "preview") {
	if (!serverSideEnv.VERCEL_GIT_PULL_REQUEST_ID) {
		throw new Error("VERCEL_GIT_PULL_REQUEST_ID is not set");
	}
	environment = PreviewEnv(serverSideEnv.VERCEL_GIT_PULL_REQUEST_ID);
}

/**
 * Get an encore API client.
 * 
 * Note: Now using PocketBase for auth instead of Clerk.
 * Authentication is handled client-side with PocketBase.
 */
export async function getApiClient() {
	// TODO: Update this to use PocketBase auth tokens if needed by Encore backend
	return new Client(environment);
}
