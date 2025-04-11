"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/helper/connection";
import { User } from "@supabase/supabase-js";
import Messages from "@/components/Messages";
import Loading from "@/helper/Loading";
import OverwriteMessages from "@/components/OverwriteMessages";

export default function SecretPage2() {
	const [user, setUser] = useState<User | null>(null);
	const [messages, setMessages] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [newMessage, setNewMessage] = useState<string>("");
	const [editingMessageId, setEditingMessageId] = useState<string | null>(
		null
	);


	useEffect(() => {
		const fetchData = async () => {
			const { data: authData, error: authError } =
				await supabase.auth.getUser();

			if (authError || !authData?.user) {
				console.error("No authenticated user found.");
				setLoading(false);
				return;
			}

			const currentUser = authData.user;
			setUser(currentUser);

			const { data: userMessages, error: fetchError } = await supabase
				.from("secret_messages")
				.select("*")
				.eq("user_id", currentUser.id);

			if (fetchError) {
				console.error(
					"Error fetching user messages:",
					fetchError.message
				);
			} else {
				setMessages(userMessages || []);
			}

			setLoading(false);
		};

		fetchData();
	}, []);

	const handleSaveMessage = async () => {
		if (!user) return;

		const messageToSave = {
			user_id: user.id,
			message: newMessage,
			updated_at: new Date().toISOString(),
		};

		let saveError;

		if (editingMessageId) {
			const { error } = await supabase
				.from("secret_messages")
				.update({ message: newMessage })
				.eq("id", editingMessageId);
			saveError = error;
		} else {
			const { error } = await supabase
				.from("secret_messages")
				.upsert(messageToSave);
			saveError = error;
		}

		if (saveError) {
			console.error("Error saving message:", saveError.message);
		} else {
			alert("Secret message saved!");
			location.reload(); // consider using re-fetch instead
		}
	};

	const handleEditMessage = (id: string, text: string) => {
		setEditingMessageId(id);
		setNewMessage(text);
	};

	const handleDeleteMessage = async (id: string) => {
		if (confirm("Are you sure you want to delete this message?")) {
			const { error } = await supabase
				.from("secret_messages")
				.delete()
				.eq("id", id);
			if (error) {
				console.error("Delete error:", error.message);
			} else {
				alert("Message deleted");
				location.reload(); // consider using re-fetch instead
			}
		}
	};

	if (loading) return <Loading loading={loading} />;

	return (
		<div className="w-auto mx-auto p-6 space-y-6">
			<h1 className="text-2xl font-bold mb-4">
				👋 Hello, {user?.user_metadata?.full_name}
			</h1>
			{/* User Messages */}
			<Messages messages={messages} />
			<OverwriteMessages
				message={messages}
				newMessage={newMessage}
				editingMessageId={editingMessageId}
				messages={messages}
				setNewMessage={setNewMessage}
				setEditingMessageId={setEditingMessageId}
				handleSaveMessage={handleSaveMessage}
				handleEditMessage={handleEditMessage}
				handleDeleteMessage={handleDeleteMessage}
			/>
		</div>
	);
}
