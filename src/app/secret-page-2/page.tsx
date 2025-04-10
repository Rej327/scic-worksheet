"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/helper/connection";
import { User } from "@supabase/supabase-js";

export default function SecretPage2() {
	const [user, setUser] = useState<User | null>(null);
	const [allMessages, setAllMessages] = useState<any[]>([]);
	const [previousMessages, setPreviousMessages] = useState<any[]>([]);
	const [message, setMessage] = useState<string | null>(null);
	const [newMessage, setNewMessage] = useState<string>("");
	const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const { data: authData, error: authError } = await supabase.auth.getUser();

			if (authError || !authData?.user) {
				console.error("No authenticated user found.");
				setLoading(false);
				return;
			}

			setUser(authData.user);

			// Fetch all messages
			const { data: messagesData, error: fetchError } = await supabase
				.from("secret_messages")
				.select("id, message, user_id, display_name");

			if (fetchError) {
				console.error("Error fetching messages:", fetchError.message);
			} else {
				setAllMessages(
					messagesData?.map((msg) => ({
						id: msg.id,
						message: msg.message,
						user_id: msg.user_id,
						display_name: msg.display_name,
						isOwner: msg.user_id === authData.user.id,
					})) || []
				);
				setPreviousMessages(
					messagesData?.filter((msg) => msg.user_id === authData.user.id) || []
				);
				setMessage(
					messagesData?.find((msg) => msg.user_id === authData.user.id)?.message || ""
				);
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
			display_name: user.user_metadata?.full_name || "Anonymous",
		};

		let saveError;

		if (editingMessageId) {
			const { error } = await supabase
				.from("secret_messages")
				.update({ message: newMessage })
				.eq("id", editingMessageId);
			saveError = error;
		} else {
			const { error } = await supabase.from("secret_messages").upsert(messageToSave);
			saveError = error;
		}

		if (saveError) {
			console.error("Error saving message:", saveError.message);
		} else {
			alert("Secret message saved!");
			location.reload(); // quick fix to reflect updated data, or you can re-fetch instead
		}
	};

	const handleEditMessage = (id: string, text: string) => {
		setEditingMessageId(id);
		setNewMessage(text);
	};

	if (loading) {
		return (
			<div className="text-center mt-10 text-gray-500">
				<span className="animate-pulse">Loading...</span>
			</div>
		);
	}

	return (
		<div className="max-w-xl mx-auto p-6 space-y-6">
			{/* All Messages */}
			<div className="bg-white rounded-lg shadow-md p-5">
				<h1 className="text-xl font-bold mb-4 text-center">All Secret Messages</h1>
				{allMessages.length === 0 ? (
					<div className="text-center text-gray-600 bg-gray-100 p-4 rounded-md">
						No secret messages yet.
					</div>
				) : (
					<div className="space-y-4">
						{allMessages.map((msg) => (
							<div
								key={msg.id}
								className={`p-4 rounded-md border shadow-sm ${
									msg.isOwner ? "bg-blue-50 border-blue-200" : "bg-gray-100"
								}`}
							>
								<div className="text-sm font-medium text-gray-600 mb-1">
									{msg.isOwner ? "Me" : msg.display_name}
								</div>
								<p className="text-gray-800 whitespace-pre-wrap">{msg.message}</p>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Message Input and Management */}
			<div className="bg-white rounded-lg shadow-md p-5">
				<h2 className="text-lg font-semibold mb-3">Your Secret Message</h2>
				<div className="mb-4">
					<p className="text-gray-700">Recent Message: {message}</p>
				</div>
				<textarea
					className="w-full p-2 mb-4 border border-gray-300 rounded-md"
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					placeholder="Write your secret message..."
				/>
				<button
					className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
					onClick={handleSaveMessage}
				>
					Save Message
				</button>

				<div className="mt-4">
					<h3 className="text-md font-semibold mb-2">Your Previous Messages</h3>
					<ul className="space-y-2">
						{previousMessages.length > 0 ? (
							previousMessages.map((msg) => (
								<li
									key={msg.id}
									className="p-4 bg-gray-100 rounded-md shadow-sm cursor-pointer hover:bg-gray-200"
									onClick={() => handleEditMessage(msg.id, msg.message)}
								>
									{msg.message}
								</li>
							))
						) : (
							<li className="p-4 bg-gray-100 rounded-md shadow-sm">
								No previous messages.
							</li>
						)}
					</ul>
				</div>
			</div>
		</div>
	);
}
