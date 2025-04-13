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
