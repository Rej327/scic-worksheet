"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/helper/connection";
import { User } from "@supabase/supabase-js";
import Messages from "@/components/Messages";
import Loading from "@/helper/Loading";
import api from "@/api/api";
import toast from "react-hot-toast";

export default function SecretPage1() {
	const [user, setUser] = useState<User | null>(null);
	const [messages, setMessages] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const { data: authData, error: authError } =
				await supabase.auth.getUser();

			if (authError || !authData?.user) {
				toast.error("No authenticated user found.");
				setLoading(false);
				return;
			}

			const currentUser = authData.user;
			setUser(currentUser);

			const { data: userMessages, error: fetchError } =
				await api.getMessageById(currentUser.id);

			if (fetchError) {
				toast.error("Error fetching user messages:");
			} else {
				setMessages(userMessages || []);
			}

			setLoading(false);
		};

		fetchData();
	}, []);

	if (loading) return <Loading loading={loading} />;
	return (
		<div className="w-auto mx-auto p-6 space-y-6">
			<h1 className="text-2xl font-bold mb-4">
				👋 Hello, {user?.user_metadata?.full_name}
			</h1>
			<Messages messages={messages} />
		</div>
	);
}
