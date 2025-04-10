"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/helper/connection";

export default function SecretLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkUser = async () => {
			const { data, error } = await supabase.auth.getUser();

			if (error || !data.user) {
				router.push("/");
			} else {
				setLoading(false);
			}
		};

		checkUser();
	}, [router]);

	if (loading) {
		return <div>Loading...</div>;
	}

	return <>{children}</>; // Only render the children when user is authenticated
}
