"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/helper/connection";
import { User } from "@supabase/supabase-js";

export default function SecretPage1() {
	const [user, setUser] = useState<User | null>(null);
	const [messages, setMessages] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const { data: authData, error: authError } = await supabase.auth.getUser();

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
				console.error("Error fetching user messages:", fetchError.message);
			} else {
				setMessages(userMessages || []);
			}

			setLoading(false);
		};

		fetchData();
	}, []);


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
				<h1 className="text-xl font-bold mb-4 text-center">Your Secret Messages</h1>
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
								<p className="text-gray-800 whitespace-pre-wrap">{msg.message}</p>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
