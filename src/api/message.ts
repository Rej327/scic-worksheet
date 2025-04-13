import { supabase } from "@/helper/connection";
import { CreateMessageProps } from "@/types/types";

// Get User Secret Message by UUID
export const getMessageById = async (id: string) => {
	const result = await supabase
		.from("secret_messages")
		.select("*")
		.eq("user_id", id);

	return result;
};

// Update User Secret Message by UUID
export const updateMessage = async (
	newMessage: string,
	editingMessageId: string
) => {
	const result = await supabase
		.from("secret_messages")
		.update({ message: newMessage })
		.eq("id", editingMessageId);

	return result;
};

//Create Secret Message
export const createMessage = async (messageToSave: CreateMessageProps) => {
	const result = await supabase.from("secret_messages").upsert(messageToSave);

	return result;
};

//Delete Secret Message
export const deleteMessage = async (id: string) => {
	const result = await supabase.from("secret_messages").delete().eq("id", id);

	return result;
};
