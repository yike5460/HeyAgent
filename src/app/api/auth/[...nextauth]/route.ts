import { handlers } from "../../../../../auth";

// Set Edge runtime for this route (required for Cloudflare Pages)
export const runtime = 'edge';

export const { GET, POST } = handlers;
