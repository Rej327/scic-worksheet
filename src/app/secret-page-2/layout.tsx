"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/helper/connection";
import Loading from "@/helper/Loading";
import Navigation from "@/components/Navigation";

export default function SecretLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

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

	if (loading) return <Loading loading={loading} />

	return <Navigation>{children}</Navigation>;
}
