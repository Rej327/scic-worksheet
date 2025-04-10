"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/helper/connection";

export default function SecretPage1() {
	const [messages, setMessages] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchSecretMessages = async () => {
			const { data: userData, error: userError } =
				await supabase.auth.getUser();

			if (userError || !userData?.user) {
				console.error("No authenticated user found.");
				setLoading(false);
				return;
			}

			const { data: messagesData, error: fetchError } = await supabase
				.from("secret_messages")
				.select("message, user_id, display_name");

			if (fetchError) {
				console.error("Error fetching messages:", fetchError.message);
			} else {
				setMessages(
					messagesData?.map((msg) => ({
						message: msg.message,
						user_id: msg.user_id,
						display_name: msg.display_name,
						isOwner: msg.user_id === userData.user.id,
					})) || []
				);
			}

			setLoading(false);
		};

		fetchSecretMessages();
	}, []);

	if (loading)
		return (
			<div className="text-center mt-10 text-gray-500">
				<span className="animate-pulse">Loading...</span>
			</div>
		);

	return (
		<div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
			<h1 className="text-xl font-bold mb-4 text-center">
				All Secret Messages
			</h1>

			{messages.length === 0 ? (
				<div className="text-center text-gray-600 bg-gray-100 p-4 rounded-md">
					No secret messages yet.
				</div>
			) : (
				<div className="space-y-4">
					{messages.map((msg, index) => (
						<div
							key={index}
							className={`p-4 rounded-md shadow-sm ${
								msg.isOwner
									? "bg-blue-50 border border-blue-200"
									: "bg-gray-100"
							}`}
						>
							<div className="text-sm font-medium text-gray-600 mb-1">
								{msg.isOwner ? "Me" : msg.display_name}
							</div>
							<p className="text-gray-800 whitespace-pre-wrap">
								{msg.message}
							</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
