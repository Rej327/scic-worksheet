"use client";

import { supabase } from "@/helper/connection";
import Auth from "@/view/Auth";
import Dashboard from "@/view/auth/Dashboard";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
	const [session, setSession] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchSession = async () => {
			try {
        setLoading(true)
				const { data } = await supabase.auth.getSession();
				setSession(data.session);
				const { data: authListener } = supabase.auth.onAuthStateChange(
					(_event, session) => {
						setSession(session);
					}
				);

				return () => {
					authListener?.subscription.unsubscribe();
				};
			} catch (error) {
				console.error("Error fetching session:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchSession();
	}, []);

	if (loading) return <p>Loading...</p>;

	return session ? (
		<Dashboard supabase={supabase} />
	) : (
		<Auth supabase={supabase} />
	);
}
