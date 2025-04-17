import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl: string = process.env.SUPABASE_URL_KEY as string;
const supabaseKey: string = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseKey) {
	throw new Error(
		"Missing SUPABASE_SERVICE_ROLE_KEY in environment variables"
	);
}

if (!supabaseUrl) {
	throw new Error("Missing SUPABASE_URL_KEY in environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
	auth: {
		persistSession: true,
		autoRefreshToken: true,
	},
});
