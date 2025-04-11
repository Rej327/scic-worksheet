import React from "react";

interface User {
	id: string;
	full_name: string;
	requestSent?: boolean;
}

interface Request {
	id: string;
	sender_full_name: string;
	receiver_full_name: string;
	receiver_id: string;
}

interface Props {
	users: User[];
	sentRequests: Request[];
	requests: Request[];
	friends: User[];
	viewedMessages: Record<string, string[]>;
	viewingError: string | null;
	sendRequest: (userId: string) => void;
	cancelRequest: (userId: string) => void;
	respondToRequest: (
		requestId: string,
		action: "accepted" | "rejected"
	) => void;
	viewMessages: (userId: string) => void;
}

const Social: React.FC<Props> = ({
	users,
	sentRequests,
	requests,
	friends,
	viewedMessages,
	viewingError,
	sendRequest,
	cancelRequest,
	respondToRequest,
	viewMessages,
}) => {
	const MessageList = ({ messages }: { messages: string[] }) => (
		<div className="bg-gray-100 p-2 rounded">
			<h4 className="font-semibold">Messages:</h4>
			<ul className="list-disc ml-4">
				{messages.map((msg, idx) => (
					<li key={idx}>{msg}</li>
				))}
			</ul>
		</div>
	);

	const PersonCard = ({
		user,
		isFriend,
	}: {
		user: User;
		isFriend?: boolean;
	}) => (
		<div className="flex flex-col gap-2 p-2 rounded mb-2">
			<div className="flex justify-between gap-2 items-center rounded-md bg-white shadow-md p-5">
				<span>{user.full_name}</span>
				<div className="flex gap-4">
					<button
						className="bg-purple-500 text-white px-3 py-1 rounded w-fit"
						onClick={() => viewMessages(user.id)}
					>
						View Messages
					</button>
					{isFriend ? null : user.requestSent ? (
						<button
							className="bg-gray-400 text-white px-3 py-1 rounded"
							onClick={() => cancelRequest(user.id)}
						>
							Cancel Request
						</button>
					) : (
						<button
							className="bg-blue-500 text-white px-3 py-1 rounded"
							onClick={() => sendRequest(user.id)}
						>
							Add Friend
						</button>
					)}
				</div>
			</div>

			{viewedMessages[user.id]?.length > 0 && (
				<MessageList messages={viewedMessages[user.id]} />
			)}

			{viewingError && <p className="text-red-500">{viewingError}</p>}
		</div>
	);

	return (
		<div className="w-[40vw]">
			{/* People You May Know */}
			<section>
				<h2 className="text-xl font-semibold mb-2">
					People You May Know
				</h2>

				{sentRequests.map((req, i) => (
					<div
						key={i}
						className="flex flex-col gap-2 p-2 rounded mb-2"
					>
						<div className="flex justify-between gap-2 items-center rounded-md bg-white shadow-md p-5">
							<span>{req.receiver_full_name}</span>
							<div className="flex gap-4">
								<button
									className="bg-purple-500 text-white px-3 py-1 rounded w-fit"
									onClick={() =>
										viewMessages(req.receiver_id)
									}
								>
									View Messages
								</button>
								<button
									className="bg-gray-400 text-white px-3 py-1 rounded"
									onClick={() =>
										cancelRequest(req.receiver_id)
									}
								>
									Cancel Request
								</button>
							</div>
						</div>
					</div>
				))}

				{users.length === 0
					? null
					: users.map((user) => (
							<PersonCard key={user.id} user={user} />
					  ))}
			</section>

			{/* Pending Friend Requests */}
			<section>
				{requests.length === 0 ? null : (
					<>
						<h2 className="text-xl font-semibold mb-2">
							Pending Friend Requests
						</h2>
						{requests.map((req, i) => (
							<div
								key={i}
								className="flex flex-col gap-2 p-2 rounded mb-2"
							>
								<div className="flex justify-between gap-2 items-center rounded-md bg-white shadow-md p-5">
									<span>{req.sender_full_name}</span>
									<div className="space-x-2">
										<button
											className="bg-green-500 text-white px-3 py-1 rounded"
											onClick={() =>
												respondToRequest(
													req.id,
													"accepted"
												)
											}
										>
											Accept
										</button>
										<button
											className="bg-red-500 text-white px-3 py-1 rounded"
											onClick={() =>
												respondToRequest(
													req.id,
													"rejected"
												)
											}
										>
											Reject
										</button>
									</div>
								</div>
							</div>
						))}
					</>
				)}
			</section>

			{/* Friends List */}
			<section>
				{friends.length === 0 ? null : (
					<>
						<h2 className="text-xl font-semibold mb-2">
							Your Friends
						</h2>
						{friends.map((friend) => (
							<PersonCard
								key={friend.id}
								user={friend}
								isFriend
							/>
						))}
					</>
				)}
			</section>
		</div>
	);
};

export default Social;
