"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/helper/connection";
import { User } from "@supabase/supabase-js";
import Messages from "@/components/Messages";
import Loading from "@/helper/Loading";
import api from "@/api/api";
import toast from "react-hot-toast";
import { MessageProps } from "@/types/message";
import { useRouter } from "next/navigation";

export default function SecretPage1() {
	const [user, setUser] = useState<User | null>(null);
	const [messages, setMessages] = useState<MessageProps[]>([]);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	useEffect(() => {
		setLoading(true);
		const checkUser = async () => {
			const { data, error } = await supabase.auth.getUser();

			if (error || !data.user) {
				router.push("/");
			}
		};

		checkUser();
		setLoading(false);
	}, [router]);

	useEffect(() => {
		setLoading(true);
		const fetchData = async () => {
			try {
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
					toast.error("Error fetching user messages.");
					setMessages([]);
				} else {
					console.log(userMessages);
					setMessages(userMessages || []);
				}
			} catch (error) {
				console.error("An error occurred:", error);
				toast.error("Something went wrong while fetching data.");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) return <Loading />;
	return (
		<div className="w-auto mx-auto p-6 space-y-6">
			<h1 className="text-2xl font-bold mb-4">
				👋 Hello, {user?.user_metadata?.full_name || "Guest"}
			</h1>
			{/* View Message */}
			<Messages messages={messages} />
		</div>
	);
}
