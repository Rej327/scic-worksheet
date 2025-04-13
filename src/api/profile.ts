import { supabase } from "@/helper/connection";

export const getProfile = async () => {
	const result = await supabase.from("profile").select("*");

	return result;
};
