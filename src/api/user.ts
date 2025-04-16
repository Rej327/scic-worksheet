import { supabase } from "@/helper/connection";
import { SaveNewUserProps } from "@/types/profile";

export const getUserById = async (id: string) => {
	const result = await supabase
		.from("profiles")
		.select("id")
		.eq("id", id)
		.single();

	return result;
};

export const saveNewUser = async ({
	id: userId,
	userFullName,
}: SaveNewUserProps) => {
	const result = await supabase
		.from("profiles")
		.upsert({ id: userId, full_name: userFullName }, { onConflict: "id" });

	return result;
};
