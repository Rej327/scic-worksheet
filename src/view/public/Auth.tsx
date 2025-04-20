"use client";

import { supabase } from "@/helper/connection";
import { SupabaseClient } from "@supabase/supabase-js";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { bg_auth, scic_logo } from "../../../public/assets";
import Image from "next/image";

interface DashboardProps {
	supabase: SupabaseClient;
}

export default function Auth({ supabase }: DashboardProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [fullname, setFullname] = useState("");
	const [isRegistering, setIsRegistering] = useState(false);
	const [errors, setErrors] = useState<{
		email?: string;
		password?: string;
		fullname?: string;
	}>({});
	const [loading, setLoading] = useState(false);

	const validate = () => {
		const newErrors: typeof errors = {};
		if (!email) newErrors.email = "* Email is required.";
		else if (!/\S+@\S+\.\S+/.test(email))
			newErrors.email = "* Invalid email format.";

		if (!password) newErrors.password = "* Password is required.";
		else if (password.length < 6)
			newErrors.password = "* Password must be at least 6 characters.";

		if (isRegistering && !fullname)
			newErrors.fullname = "* Full name is required.";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleAuth = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;
		setLoading(true);

		if (isRegistering) {
			const { error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						full_name: fullname,
					},
				},
			});

			if (error) {
				toast.error(error.message || "Registration error");
				setLoading(false);
				return;
			}

			toast.success("Registration successful!");
		} else {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				toast.error(error.message || "Login failed");
				setLoading(false);
				return;
			}

			toast.success("Login successful!");
		}
		setLoading(false);
	};

	return (
		<div className="min-h-screen flex flex-col">
			<div className="w-full h-[350px] bg-green-950 flex items-center justify-center relative overflow-hidden rounded-b-2xl shadow-2xl">
				<div
					className="absolute inset-0 opacity-30 rounded-b-2xl"
					style={{
						backgroundImage: `url(${bg_auth.src})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				/>
				<div className="z-10 text-center px-6">
					<h1 className="text-3xl md:text-5xl font-bold tracking-wider text-white mb-2">
						SCIC Worksheet
					</h1>
					<p className="text-white text-lg md:text-xl">
						Secret Page App – Sign in or Create an Account
					</p>
				</div>
			</div>

			<div className="flex flex-col items-center justify-center py-10 px-4">
				<div className="-mt-28 z-100 w-full max-w-md bg-white p-6 rounded-lg shadow-md">
					<Image
						src={scic_logo}
						alt="Logo"
						width={250}
						height={150}
						className="mx-auto mb-4"
					/>
					<h2 className="text-xl text-green-900 font-semibold mb-4 text-center">
						{isRegistering
							? "Create Account"
							: "Login to Your Account"}
					</h2>

					<form onSubmit={handleAuth} className="space-y-4">
						{isRegistering && (
							<div>
								<input
									data-testid="fullname"
									className="border border-gray-300 p-2 w-full rounded focus:outline-green-600"
									type="text"
									placeholder="Full Name"
									value={fullname}
									onChange={(e) =>
										setFullname(e.target.value)
									}
								/>
								{errors.fullname && (
									<p className="text-red-500 text-sm mt-1">
										{errors.fullname}
									</p>
								)}
							</div>
						)}

						<div>
							<p className="text-right text-xs text-red-800">
								Note: Email verification is disabled for
								testing.
							</p>
							<input
								data-testid="email"
								className={`border border-gray-300 p-2 w-full rounded focus:outline-green-600 ${
									errors.email && "border-red-500"
								}`}
								type="email"
								placeholder="Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								formNoValidate
							/>

							{errors.email && (
								<p className="text-red-500 text-sm mt-1">
									{errors.email}
								</p>
							)}
						</div>

						<div>
							<input
								data-testid="password"
								className={`border border-gray-300 p-2 w-full rounded focus:outline-green-600 ${
									errors.password && "border-red-500"
								}`}
								type="password"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							{errors.password && (
								<p className="text-red-500 text-sm mt-1">
									{errors.password}
								</p>
							)}
						</div>

						<button
							data-testid="submit-button"
							type="submit"
							disabled={loading}
							className={`flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white p-2 w-full rounded font-medium transition duration-300 cursor-pointer ${
								loading ? "opacity-60 cursor-not-allowed" : ""
							}`}
						>
							{loading && (
								<svg
									className="animate-spin h-5 w-5 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
									></path>
								</svg>
							)}
							{loading
								? "Please wait..."
								: isRegistering
								? "Register"
								: "Login"}
						</button>
					</form>

					<div className="mt-4 text-center">
						<button
							className="text-sm text-green-600 hover:underline underline-offset-4 cursor-pointer"
							onClick={() => {
								setIsRegistering(!isRegistering);
								setErrors({});
							}}
						>
							{isRegistering
								? "Already have an account? Login"
								: "Need an account? Register"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
