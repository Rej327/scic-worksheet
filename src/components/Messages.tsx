import React from "react";

interface Message {
	id: string;
	message: string;
	updated_at?: string; // make it optional if it's not always present
}

interface MessagesProps {
	messages: Message[];
	title?: string;
	emptyText?: string;
}

export default function Messages({
	messages,
	title = "Your Secret Messages",
	emptyText = "You haven't written any secret messages yet.",
}: MessagesProps) {
	return (
		<div>
			<h1 className="text-xl font-semibold mb-4 tracking-wider text-[#222222]">
				{title}
			</h1>
			<div className="w-fit p-2">
				{messages.length === 0 ? (
					<div className="text-center text-gray-600 bg-gray-100 p-4 rounded-md">
						{emptyText}
					</div>
				) : (
					<div className="space-y-4 grid grid-cols-1 md:grid-cols-3 gap-4">
						{messages.map((msg) => (
							<div
								key={msg.id}
								className="rounded-md bg-white w-fit shadow-md p-5"
							>
								<p className="text-gray-800 whitespace-pre-wrap mb-2">
									{msg.message}
								</p>
								{msg.updated_at && (
									<p className="text-xs text-gray-500 italic">
										Last updated:{" "}
										{new Date(
											msg.updated_at
										).toLocaleString()}
									</p>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
