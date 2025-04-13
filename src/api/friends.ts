import { supabase } from "@/helper/connection";
import { FindRequestProps, SentRequestProps } from "@/types/types";

export const getFriendsByBothId = async (id: string) => {
	const result = await supabase
		.from("friend_status")
		.select("*")
		.or(`sender_id.eq.${id},receiver_id.eq.${id}`);

	return result;
};

export const sentRequest = async ({
	sender_id: currentUserId,
	receiver_id: receiverId,
}: SentRequestProps) => {
	const result = await supabase.from("friend_status").insert([
		{
			sender_id: currentUserId,
			receiver_id: receiverId,
		},
	]);

	return result;
};

export const cancelRequest = async ({
	currentUserId: currentUserId,
	receiver_id: receiver_id,
}: FindRequestProps) => {
	const result = await supabase
		.from("friend_status")
		.select("*")
		.eq("sender_id", currentUserId)
		.eq("receiver_id", receiver_id)
		.eq("status", "pending");

	return result;
};

export const deleteRequest = async (id: string) => {
	const result = await supabase.from("friend_status").delete().eq("id", id);

	return result;
};
