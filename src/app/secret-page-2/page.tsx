"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/helper/connection";
import { User } from "@supabase/supabase-js";

export default function SecretPage2() {
	const [user, setUser] = useState<User | null>(null);
	const [messages, setMessages] = useState<any[]>([]);
	const [message, setMessage] = useState<string | null>(null);
	const [newMessage, setNewMessage] = useState<string>("");
	const [editingMessageId, setEditingMessageId] = useState<string | null>(
		null
	);
	const [loading, setLoading] = useState(true);

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
				setMessage(userMessages?.[0]?.message || "");
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

	if (loading) {
		return (
			<div className="text-center mt-10 text-gray-500">
				<span className="animate-pulse">Loading...</span>
			</div>
		);
	}

	return (
		<div className="max-w-xl mx-auto p-6 space-y-6">
			{/* User Messages */}
			<div className="bg-white rounded-lg shadow-md p-5">
				<h1 className="text-xl font-bold mb-4 text-center">
					Your Secret Messages
				</h1>
				{messages.length === 0 ? (
					<div className="text-center text-gray-600 bg-gray-100 p-4 rounded-md">
						You haven't written any secret messages yet.
					</div>
				) : (
					<div className="space-y-4">
						{messages.map((msg) => (
							<div
								key={msg.id}
								className="p-4 bg-blue-50 border border-blue-200 rounded-md shadow-sm"
							>
								<p className="text-gray-800 whitespace-pre-wrap">
									{msg.message}
								</p>
							</div>
						))}
					</div>
				)}
			</div>

			<div className="bg-white rounded-lg shadow-md p-5">
				<h2 className="text-lg font-semibold mb-3">
					{editingMessageId
						? "Edit Secret Message"
						: "Write a Secret Message"}
				</h2>
				<div className="mb-4">
					<p className="text-gray-700">Recent Message: {message}</p>
				</div>
				<textarea
					className="w-full p-2 mb-4 border border-gray-300 rounded-md"
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					placeholder="Write your secret message..."
				/>
				<div className="flex space-x-2">
					<button
						className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
						onClick={handleSaveMessage}
					>
						{editingMessageId ? "Update Message" : "Save Message"}
					</button>
					{editingMessageId && (
						<button
							className="w-full p-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
							onClick={() => {
								setEditingMessageId(null);
								setNewMessage("");
							}}
						>
							Cancel
						</button>
					)}
				</div>

				<div className="mt-4">
					<h3 className="text-md font-semibold mb-2">
						Tap to Edit Your Previous Messages
					</h3>
					<ul className="space-y-2">
						{messages.length > 0 ? (
							messages.map((msg) => (
								<li
									key={msg.id}
									className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-sm"
								>
									<span className="text-gray-800 break-words w-full mr-4">
										{msg.message}
									</span>
									<div className="flex space-x-2 shrink-0">
										<button
											className="px-3 py-1 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 text-sm"
											onClick={() =>
												handleEditMessage(
													msg.id,
													msg.message
												)
											}
										>
											Edit
										</button>
										<button
											className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
											onClick={async () => {
												if (
													confirm(
														"Are you sure you want to delete this message?"
													)
												) {
													const { error } =
														await supabase
															.from(
																"secret_messages"
															)
															.delete()
															.eq("id", msg.id);
													if (error) {
														console.error(
															"Delete error:",
															error.message
														);
													} else {
														alert(
															"Message deleted"
														);
														location.reload(); // or refetch messages manually
													}
												}
											}}
										>
											Delete
										</button>
									</div>
								</li>
							))
						) : (
							<li className="p-4 bg-gray-100 rounded-md shadow-sm">
								No messages to edit.
							</li>
						)}
					</ul>
				</div>
			</div>
		</div>
	);
}
