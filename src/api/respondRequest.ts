import { supabase } from "@/helper/connection";
import { FriendRequestProps } from "@/types/types";

export const acceptRequest = async ({ status, id }: FriendRequestProps) => {
	const result = await supabase
		.from("friend_status")
		.update({ status })
		.eq("id", id);

	return result;
};

export const rejectRequest = async (id: string) => {
	const result = await supabase.from("friend_request").delete().eq("id", id);

	return result;
};
