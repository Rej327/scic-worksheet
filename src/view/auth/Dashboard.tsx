"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaEdit, FaEnvelope, FaUsers } from "react-icons/fa";

export default function Dashboard() {
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
