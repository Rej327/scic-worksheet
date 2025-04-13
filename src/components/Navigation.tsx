"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/helper/connection";
import {
	FaHome,
	FaEnvelope,
	FaEdit,
	FaUsers,
	FaSignOutAlt,
	FaTrashAlt,
} from "react-icons/fa";
import { background } from "../../public/assets";
import toast from "react-hot-toast";
import ConfirmationDeleteModal from "./ConfirmationModal";

export default function Navigation({
	children,
}: {
	children: React.ReactNode;
}) {
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const [isLogout, setIslogout] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const pathname = usePathname(); // ⬅️ Get current path
	const route = useRouter();

	const handleLogoutModal = () => {
		setIslogout(true);
		setShowDeleteModal(true);
	};

	const handleLogout = async () => {
		try {
			setLoading(true);
			await supabase.auth.signOut();
			route.push("/");
		} catch {
			toast.error("Error on logout");
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteModal = () => {
		setIslogout(false);
		setShowDeleteModal(true);
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
			const { error } = await supabase.auth.admin.deleteUser(id);
			if (error) {
				toast.error("Error deleting user");
				return;
			}

			await supabase.auth.signOut();
			location.reload();
		} catch (error) {
			toast.error("Unexpected error during user deletion:");
		}
	};

	// Reusable nav link component
	const NavLink = ({
		href,
		icon,
		label,
	}: {
		href: string;
		icon: React.ReactNode;
		label: string;
	}) => {
		const isActive = pathname === href;

		return (
			<Link
				href={href}
				className={`py-2 px-4 rounded flex items-center gap-4 transition ${
					isActive
						? "bg-white/30 font-semibold cursor-default"
						: "hover:bg-white/20"
				}`}
			>
				{icon} {label}
			</Link>
		);
	};

	return (
		<div className="flex min-h-screen">
			{/* Sidebar */}
			<aside className="fixed min-w-[15vw]">
				<div
					className="relative w-72 h-screen text-white flex flex-col justify-between"
					style={{
						backgroundImage: `url(${background.src})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				>
					{/* Green overlay */}
					<div className="absolute inset-0 bg-green-800/90 z-0" />

					{/* Content */}
					<div className="relative z-10">
						<h2 className="text-2xl font-bold p-4 border-b-2 border-white/20">
							SCIC Worksheet
						</h2>
						<nav className="flex flex-col gap-2 p-4">
							<NavLink
								href="/"
								icon={<FaHome className="text-xl" />}
								label="Dashboard"
							/>
							<NavLink
								href="/secret-page-1"
								icon={<FaEnvelope className="text-xl" />}
								label="My Messages"
							/>
							<NavLink
								href="/secret-page-2"
								icon={<FaEdit className="text-xl" />}
								label="Overwrite Msgs"
							/>
							<NavLink
								href="/secret-page-3"
								icon={<FaUsers className="text-xl" />}
								label="Socials"
							/>
						</nav>
					</div>

					<div className="p-4 border-t border-green-700 space-y-2 relative z-10">
						<button
							onClick={handleLogoutModal}
							className="w-full hover:bg-white/20 py-2 px-4 rounded flex items-center justify-start gap-4 cursor-pointer"
						>
							<FaSignOutAlt className="text-xl" /> Logout
						</button>
						<button
							onClick={handleDeleteModal}
							className="w-full hover:bg-white/20 py-2 px-4 rounded flex items-center justify-start gap-4 cursor-pointer"
						>
							<FaTrashAlt className="text-xl" /> Delete Account
						</button>
					</div>
				</div>
			</aside>
			{/* Main content */}
			<main className="p-6 bg-gray-100 min-w-[85vw] ml-auto text-gray-900">
				<ConfirmationDeleteModal
					title={isLogout ? "logout" : "delete"}
					text={`Are you sure you want ${
						isLogout ? "to logout" : "to delete"
					} this account?`}
					isOpen={showDeleteModal}
					onClose={() => setShowDeleteModal(false)}
					onConfirm={isLogout ? handleLogout : handleDelete}
				/>
				{children}
			</main>
		</div>
	);
}
