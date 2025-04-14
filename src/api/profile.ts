import { supabase } from "@/helper/connection";

//Get Users for people you may know
export const getProfile = async () => {
	const result = await supabase.from("profiles").select("*");

	return result;
};
