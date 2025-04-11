"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/helper/connection";
import { User } from "@supabase/supabase-js";
import Messages from "@/components/Messages";
import Loading from "@/helper/Loading";

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


	if (loading) return <Loading loading={loading} />
	return (
		<div className="max-w-xl mx-auto p-6 space-y-6">
			{/* User Messages */}
			<Messages messages={messages} />
		</div>
	);
}
