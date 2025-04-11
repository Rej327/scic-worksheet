"use client";

import Loading from "@/helper/Loading";
import { SupabaseClient, User } from "@supabase/supabase-js";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaEdit, FaEnvelope, FaUsers } from "react-icons/fa";

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

	const secretPages = [
		{ id: "1", title: "Messages", icon: <FaEnvelope size={50} /> },
		{ id: "2", title: "Overwrite Messages", icon: <FaEdit size={50} /> },
		{ id: "3", title: "Socials", icon: <FaUsers size={50} /> },
	];

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
			{secretPages.map((page) => (
				<Link href={`/secret-page-${page.id}`} key={page.id}>
					<div className="bg-white hover:bg-green-200 cursor-pointer rounded-2xl shadow-md p-6 flex flex-col items-center justify-evenly h-48 transition duration-300 ease-in-out">
						<div className="text-green-700">{page.icon}</div>
						<div className="text-lg font-semibold text-center text-green-900">
							{page.title}
						</div>
					</div>
				</Link>
			))}
		</div>
	);
}
