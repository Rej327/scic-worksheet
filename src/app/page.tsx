"use client";

import Navigation from "@/components/Navigation";
import { supabase } from "@/helper/connection";
import Loading from "@/helper/Loading";
import Dashboard from "@/view/auth/Dashboard";
import Auth from "@/view/public/Auth";

import { useEffect, useState } from "react";

export default function Home() {
	const [session, setSession] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	// Save profile to Supabase table
	const saveProfile = async (user: any) => {
		const userId = user.id;
		const fullName = user.user_metadata?.full_name || "";

		const { error } = await supabase
			.from("profile")
			.upsert({ id: userId, full_name: fullName });

		if (error) {
			console.error("Error saving profile:", error.message);
		} else {
			console.log("Profile saved successfully.");
		}
	};

	useEffect(() => {
		const fetchSession = async () => {
			try {
				const { data } = await supabase.auth.getSession();
				setSession(data.session);

				if (data.session?.user) {
					await saveProfile(data.session.user);
				}
			} catch (error) {
				console.error("Error fetching session:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchSession();

		// Auth state change listener
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			setSession(session);

			if (event === "SIGNED_IN" && session?.user) {
				await saveProfile(session.user);
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, []);

	if (loading) {
		return (
			<div className="w-screen h-screen">
				<Loading loading={loading} />
			</div>
		);
	}

	return session ? (
		<Navigation>
			<div className="px-4">
				<h1 className="text-2xl font-bold mb-4 mt-6">
					👋 Hello, {session.user.user_metadata?.full_name}
				</h1>
				<Dashboard supabase={supabase} />
			</div>
		</Navigation>
	) : (
		<Auth supabase={supabase} />
	);
}
