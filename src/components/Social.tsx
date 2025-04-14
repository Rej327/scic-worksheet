import React from "react";
import { FaEnvelope } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";
import { IoMdPersonAdd } from "react-icons/io";
import { MdDeleteSweep } from "react-icons/md";
import { TbCancel } from "react-icons/tb";
import IconWithTooltip from "./IconWithTooltip";
import { SocialProps } from "@/types/social";
import { User } from "@/types/user";

const Social: React.FC<SocialProps> = ({
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
		<div className="bg-[#D5F0CE] p-2 rounded">
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
				<span className="capitalize">{user.full_name}</span>
				<div className="flex gap-4">
					<IconWithTooltip
						text="View Secret Message"
						textColor="text-violet-500"
						icon={<FaEnvelope size={20} />}
						onClick={() => viewMessages(user.id)}
					/>
					{isFriend ? null : user.requestSent ? (
						<IconWithTooltip
							text="Cancel Request"
							textColor="text-red-500"
							icon={<TbCancel size={20} />}
							onClick={() => cancelRequest(user.id)}
						/>
					) : (
						<IconWithTooltip
							text="Friend Request"
							textColor="text-blue-500"
							icon={<IoMdPersonAdd size={20} />}
							onClick={() => sendRequest(user.id)}
						/>
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
		<div className="w-auto md:w-[40vw]">
			{/* People You May Know */}
			<section>
				{users.length === 0 ? null : (
					<>
						<h2 className="text-xl font-semibold mb-2">
							People You May Know
						</h2>{" "}
						{users.map((user) => (
							<PersonCard key={user.id} user={user} />
						))}
					</>
				)}

				{sentRequests.length === 0 ? null : (
					<>
						<h2 className="text-xl font-semibold mb-2">
							Sent Friend Requests
						</h2>
						{sentRequests.map((req, i) => (
							<div
								key={i}
								className="flex flex-col gap-2 p-2 rounded mb-2"
							>
								<div className="flex justify-between gap-2 items-center rounded-md bg-white shadow-md p-5">
									<span>{req.receiver_full_name}</span>
									<div className="flex gap-4">
										<IconWithTooltip
											text="View Secret Message"
											textColor="text-violet-500"
											icon={<FaEnvelope size={20} />}
											onClick={() =>
												viewMessages(req.receiver_id)
											}
										/>
										<IconWithTooltip
											text="Cancel Request"
											textColor="text-red-500"
											icon={<TbCancel size={20} />}
											onClick={() =>
												cancelRequest(req.receiver_id)
											}
										/>
									</div>
								</div>
							</div>
						))}
					</>
				)}
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
									<span className="capitalize">
										{req.sender_full_name}
									</span>
									<div className="space-x-1">
										<div className="flex gap-2">
											<IconWithTooltip
												text="Accept Request"
												textColor="text-green-500"
												icon={<GiConfirmed size={20} />}
												onClick={() =>
													respondToRequest(
														req.id,
														"accepted"
													)
												}
											/>

											<IconWithTooltip
												text="Reject Request"
												textColor="text-red-500"
												icon={
													<MdDeleteSweep size={20} />
												}
												onClick={() =>
													respondToRequest(
														req.id,
														"rejected"
													)
												}
											/>
										</div>
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
