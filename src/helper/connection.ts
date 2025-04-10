import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables from .env.local file
dotenv.config();

const supabaseUrl: string = "https://bfsshhzqkdyfxozvrlne.supabase.co";
// const supabaseKey: string = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseKey: string =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmc3NoaHpxa2R5ZnhvenZybG5lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDI4ODE4MiwiZXhwIjoyMDU5ODY0MTgyfQ.kriNnH8U8NqX9MDF91SV612E_0wVrCLMem3Lr-NJd9g";

if (!supabaseKey) {
	throw new Error(
		"Missing SUPABASE_SERVICE_ROLE_KEY in environment variables"
	);
}

export const supabase = createClient(supabaseUrl, supabaseKey);
