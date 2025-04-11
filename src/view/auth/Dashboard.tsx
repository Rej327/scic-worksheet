"use client";

import Loading from "@/helper/Loading";
import { SupabaseClient, User } from "@supabase/supabase-js";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface DashboardProps {
	supabase: SupabaseClient;
}

export default function Dashboard({ supabase }: DashboardProps) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchUser = async () => {
			const { data, error } = await supabase.auth.getUser();
			if (error) {
				console.error("Error fetching user:", error.message);
			} else {
				setUser(data.user);
			}
		};

		fetchUser();
	}, [supabase]);

	const handleLogout = async () => {
		try {
			setLoading(true);
			await supabase.auth.signOut();
		} catch {
			console.log("Error on logout");
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async () => {
		const { data: userData, error: userError } =
			await supabase.auth.getUser();

		if (userError) {
			console.error("Error fetching user:", userError.message);
			return;
		}

		const id = userData?.user?.id;

		if (!id) {
			console.error("User ID is missing");
			return;
		}

		try {
			console.log("User ID to delete:", id);

			const { error } = await supabase.auth.admin.deleteUser(id);
			if (error) {
				console.error("Error deleting user:", error.message);
				return;
			} else {
				console.log("User deleted successfully");
			}

			console.log("User deleted successfully");

			await supabase.auth.signOut();
			location.reload();
		} catch (error) {
			console.error("Unexpected error during user deletion:", error);
		}
	};

	if (loading) return <Loading loading={loading} />;

	return (
		<div className="p-6 max-w-md mx-auto">
			<h1 className="text-xl mb-4">
				Welcome {user?.user_metadata?.full_name}
			</h1>
			{["1", "2", "3"].map((page, idx) => (
				<Link href={`/secret-page-${page}`} key={idx}>
					<button className="bg-green-500 text-white p-2 w-full mb-2">
						Secret Page {page}
					</button>
				</Link>
			))}

			<button
				className="bg-red-500 text-white p-2 w-full mb-2"
				onClick={handleLogout}
			>
				Logout
			</button>
			<button
				className="bg-red-700 text-white p-2 w-full"
				onClick={handleDelete}
			>
				Delete Account
			</button>
		</div>
	);
}
