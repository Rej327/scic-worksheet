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
import { NavItemProps } from "@/types/types";

const NavItem: NavItemProps[] = [
	{
		href: "/",
		icon: <FaHome className="text-xl" />,
		label: "Dashboard",
	},
	{
		href: "/secret-page-1",
		icon: <FaEnvelope className="text-xl" />,
		label: "My Messages",
	},
	{
		href: "/secret-page-2",
		icon: <FaEdit className="text-xl" />,
		label: "Overwrite Msgs",
	},
	{
		href: "/secret-page-3",
		icon: <FaUsers className="text-xl" />,
		label: "Socials",
	},
];

const NavLink = ({
	href,
	icon,
	label,
}: {
	href: string;
	icon: React.ReactNode;
	label: string;
}) => {
	const pathname = usePathname();
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

export default function Navigation({
	children,
}: {
	children: React.ReactNode;
}) {
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const [isLogout, setIslogout] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

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

	return (
		<div className="flex flex-col md:flex-row min-h-screen">
			<aside className="w-full md:w-[15vw] md:fixed z-20">
				<div
					className="relative h-[400px] md:h-screen text-white flex flex-col justify-between"
					style={{
						backgroundImage: `url(${background.src})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				>
					<div className="absolute inset-0 bg-green-800/90 z-0" />
					<div className="relative z-10">
						<h1 className="text-xl font-semibold p-4 border-b-2 border-white/20">
							SCIC Worksheet
						</h1>
						<nav className="flex flex-col gap-2 p-4">
							{NavItem.map((link, i) => (
								<NavLink
									key={i}
									href={link.href}
									icon={link.icon}
									label={link.label}
								/>
							))}
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

			<main className="w-full md:ml-[15vw] bg-gray-100 text-gray-900 p-6">
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
