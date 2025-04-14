import { ConfirmationModalProps } from "@/types/modal";
import React, { useEffect, useState } from "react";

export default function ConfirmationDeleteModal({
	isOpen,
	onClose,
	onConfirm,
	text,
	title,
}: ConfirmationModalProps) {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (isOpen) setVisible(true);
	}, [isOpen]);

	const handleClose = () => {
		setVisible(false);
		setTimeout(onClose, 300);
	};

	if (!isOpen) return null;

	return (
		<div
			className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
				visible ? "opacity-100 bg-black/80" : "opacity-0 bg-black/0"
			}`}
		>
			<div
				className={`bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center transform transition duration-300 ${
					visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
				}`}
			>
				<h2 className="text-lg font-semibold mb-4">Confirm {title}</h2>
				<p className="mb-6">{text}</p>
				<div className="flex justify-center gap-4">
					<button
						onClick={handleClose}
						className="px-4 py-2 rounded-full bg-gray-300 hover:bg-gray-400 text-gray-800 duration-150 delay-75 cursor-pointer"
					>
						No
					</button>
					<button
						onClick={onConfirm}
						className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white duration-150 delay-75 cursor-pointer"
					>
						Yes
					</button>
				</div>
			</div>
		</div>
	);
}
