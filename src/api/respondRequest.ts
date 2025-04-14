import { supabase } from "@/helper/connection";
import { FriendRequestProps } from "@/types/friends";

//Accept friend request
export const acceptRequest = async ({ status, id }: FriendRequestProps) => {
	const result = await supabase
		.from("friends_status")
		.update({ status })
		.eq("id", id);

	return result;
};

//Reject friend request and delete in the table
export const rejectRequest = async (id: string) => {
	const result = await supabase.from("friends_status").delete().eq("id", id);

	return result;
};
