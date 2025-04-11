"use client";

import Navigation from "@/components/Navigation";
import { supabase } from "@/helper/connection";
import Loading from "@/helper/Loading";
import Auth from "@/view/Auth";
import Dashboard from "@/view/auth/Dashboard";

import { useEffect, useState } from "react";

export default function Home() {
	const [session, setSession] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchSession = async () => {
			try {
				setLoading(true);
				const { data } = await supabase.auth.getSession();
				setSession(data.session);

				if (data.session?.user) {
					await saveProfile(data.session.user);
				}

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
			} catch (error) {
				console.error("Error fetching session:", error);
			} finally {
				setLoading(false);
			}
		};

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

		fetchSession();
	}, []);

	if (loading)
		return (
			<div className="w-screen h-screen">
				<Loading loading={loading} />
			</div>
		);
	return session ? (
		<Navigation>
			<Dashboard supabase={supabase} />
		</Navigation>
	) : (
		<Auth supabase={supabase} />
	);
}
