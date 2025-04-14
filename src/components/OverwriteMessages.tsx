import { OverwriteMessagesProps } from "@/types/types";
import React from "react";

export default function OverwriteMessages({
	newMessage,
	editingMessageId,
	messages,
	setNewMessage,
	setEditingMessageId,
	handleSaveMessage,
	handleEditMessage,
	handleDeleteMessage,
	disabled = false,
	onGoBack,
}: OverwriteMessagesProps) {
	return (
		<div className="md:fixed md:top-0 md:right-0 w-full md:w-1/3 lg:w-1/4 h-full p-2 md:p-5">
			<div className="relative h-full w-full">
				{/* Blurred content wrapper */}
				<div
					className={`bg-white rounded-lg shadow-md h-full overflow-y-auto transition-all duration-300 p-5 ${
						disabled ? "blur-sm pointer-events-none opacity-60" : ""
					}`}
				>
					<h2 className="text-lg font-semibold mb-3">
						{editingMessageId
							? "Edit Secret Message"
							: "Write a Secret Message"}
					</h2>

					<textarea
						className="w-full p-2 mb-4 border border-gray-300 rounded-md"
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						placeholder="Write your secret message..."
					/>

					<div className="flex space-x-2">
						<button
							className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
							onClick={handleSaveMessage}
						>
							{editingMessageId
								? "Update Message"
								: "Save Message"}
						</button>
						{editingMessageId && (
							<button
								className="w-full p-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
								onClick={() => {
									setEditingMessageId(null);
									setNewMessage("");
								}}
							>
								Cancel
							</button>
						)}
					</div>

					<div className="mt-4">
						<h3 className="text-md font-semibold mb-2">
							Tap to Edit Your Previous Messages
						</h3>
						<ul className="space-y-2">
							{messages.length > 0 ? (
								messages.map((msg) => (
									<li
										key={msg.id}
										className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-sm"
									>
										<span className="text-gray-800 break-words w-full mr-4">
											{msg.message}
										</span>
										<div className="flex space-x-2 shrink-0">
											<button
												className="cursor-pointer px-3 py-1 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 shadow-sm text-sm"
												onClick={() =>
													handleEditMessage(
														msg.id,
														msg.message
													)
												}
											>
												Edit
											</button>
											<button
												className="cursor-pointer px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm text-sm"
												onClick={() =>
													handleDeleteMessage(msg.id)
												}
											>
												Delete
											</button>
										</div>
									</li>
								))
							) : (
								<li className="p-4 bg-gray-100 rounded-md shadow-sm">
									No messages to edit.
								</li>
							)}
						</ul>
					</div>
				</div>

				{/* Overlay Go Back Button */}
				{disabled && (
					<div className="absolute inset-0 flex items-center justify-center z-10">
						<button
							onClick={onGoBack}
							className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 shadow-md text-sm cursor-pointer"
						>
							Go Back
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
