"use client";

import { supabase } from "@/helper/connection";
import { SupabaseClient } from "@supabase/supabase-js";
import React, { useState } from "react";

interface DashboardProps {
	supabase: SupabaseClient;
}

export default function Auth({ supabase }: DashboardProps) {
	const [email, setEmail] = useState("resujeff27@gmail.com");
	const [password, setPassword] = useState("asdasdasd");
	const [fullname, setFullname] = useState(""); // Add fullname state
	const [isRegistering, setIsRegistering] = useState(false);

	const handleAuth = async () => {
		if (isRegistering) {
			// Registration: Store full name as user_metadata
			const { error } = await supabase.auth.signUp({
				email: email,
				password: password,
				options: {
					data: {
						full_name: fullname, // Store full name in user_metadata as display name
					},
				},
			});

			if (error) {
				console.error("Registration error:", error.message);
				return;
			}

			console.log("User registered successfully.");
		} else {
			await supabase.auth.signInWithPassword({
				email,
				password,
			});
		}
	};

	return (
		<div className="p-6 max-w-md mx-auto">
			<h1 className="text-xl mb-4">
				{isRegistering ? "Register" : "Login"}
			</h1>
			{isRegistering && (
				<input
					className="border p-2 w-full mb-2"
					type="text"
					placeholder="Full Name"
					value={fullname}
					onChange={(e) => setFullname(e.target.value)}
				/>
			)}
			<input
				className="border p-2 w-full mb-2"
				type="email"
				placeholder="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<input
				className="border p-2 w-full mb-2"
				type="password"
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<button
				className="bg-blue-500 text-white p-2 w-full mb-2"
				onClick={handleAuth}
			>
				{isRegistering ? "Register" : "Login"}
			</button>
			<button
				className="text-sm underline"
				onClick={() => setIsRegistering(!isRegistering)}
			>
				{isRegistering
					? "Already have an account? Login"
					: "Need an account? Register"}
			</button>
		</div>
	);
}
