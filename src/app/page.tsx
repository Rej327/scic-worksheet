"use client";

import Loading from "@/helper/Loading";
import Auth from "@/view/public/Auth";
import { useSession } from "@/context/SessionContext";
import { supabase } from "@/helper/connection";
import Navigation from "@/components/Navigation";
import Dashboard from "@/view/auth/Dashboard";

export default function Home() {
	const { session, loading } = useSession();

	if (loading) {
		return (
			<div className="w-screen h-screen">
				<Loading />
			</div>
		);
	}

	return session ? (
		<Navigation>
			<div className="px-4">
				<Dashboard />
			</div>
		</Navigation>
	) : (
		<Auth supabase={supabase} />
	);
}
