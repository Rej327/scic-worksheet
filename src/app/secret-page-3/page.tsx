"use client";

import api from "@/api/api";
import { createMessage, updateMessage } from "@/api/message";
import ConfirmationDeleteModal from "@/components/ConfirmationModal";
import Messages from "@/components/Messages";
import OverwriteMessages from "@/components/OverwriteMessages";
import Social from "@/components/Social";
import { supabase } from "@/helper/connection";
import Loading from "@/helper/Loading";
import { FriendRequestStatusProps } from "@/types/friends";
import { MessageProps } from "@/types/message";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SecretPage3() {
	// ✅ Secret Page 1 inherited State
	const [user, setUser] = useState<User | null>(null);
	const [messages, setMessages] = useState<MessageProps[]>([]);
	const [loading, setLoading] = useState(true);

	// ✅ Secret Page 2 inherited Logic
	const [newMessage, setNewMessage] = useState<string>("");
	const [editingMessageId, setEditingMessageId] = useState<string | null>(
		null
	);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [messageToDeleteId, setMessageToDeleteId] = useState<string | null>(
		null
	);

	// ✅ Added State
	const [currentUser, setCurrentUser] = useState<any>(null);
	const [users, setUsers] = useState<any[]>([]);
	const [friendData, setFriendData] = useState<{
		friends: FriendRequestStatusProps[];
		requests: FriendRequestStatusProps[];
		sentRequests: FriendRequestStatusProps[];
	}>({
		friends: [],
		requests: [],
		sentRequests: [],
	});
	[];
	const [viewedMessages, setViewedMessages] = useState<{
		[key: string]: string[];
	}>({});
	const [viewingError, setViewingError] = useState<string | null>(null);
	const [friendMessages, setFriendMessages] = useState<MessageProps[]>([]);
	const [isMyMessage, setIsMyMessage] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);
	const router = useRouter();

	// ✅ Secret Page 1 inherited Logic
	useEffect(() => {
		setLoading(true);
		const checkUser = async () => {
			const { data, error } = await supabase.auth.getUser();

			if (error || !data.user) {
				router.push("/");
			}
		};

		checkUser();
		setLoading(false);
	}, [router]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch user from Supabase
				const { data: authData, error: authError } =
					await supabase.auth.getUser();

				if (authError || !authData?.user) {
					toast.error("No authenticated user found.");
					setLoading(false);
					return;
				}

				// Set user state
				const currentUser = authData.user;
				setUser(currentUser);

				// Fetch messages for the user
				const { data: userMessages, error: fetchError } =
					await api.getMessageById(currentUser.id);

				if (fetchError) {
					toast.error("Error fetching user messages.");
					setMessages([]); // Set an empty array to avoid null issues
				} else {
					console.log(userMessages);
					setMessages(userMessages || []);
				}
			} catch (error) {
				console.error("An error occurred:", error);
				toast.error("Something went wrong while fetching data.");
			} finally {
				// Always set loading to false
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	// ✅ Secret Page 2 inherited Logic
	const handleSaveMessage = async () => {
		if (!user) return;

		const messageToSave = {
			user_id: user.id,
			message: newMessage,
			updated_at: new Date().toISOString(),
		};

		try {
			let result;

			if (editingMessageId) {
				result = await updateMessage(newMessage, editingMessageId);
				toast.success("Secret message updated!");
			} else {
				result = await createMessage(messageToSave);
				toast.success("Secret message saved!");
			}

			if (result.error) {
				toast.error("Something went wrong!");
			}
		} catch (error: any) {
			toast.error("Failed to save message. Please try again.");
		} finally {
			setTimeout(() => {
				location.reload();
			}, 1500);
		}
	};

	//Setter to edit Message
	const handleEditMessage = (id: string, text: string) => {
		setEditingMessageId(id);
		setNewMessage(text);
	};

	//Delete message function
	const handleDeleteMessage = async () => {
		if (!messageToDeleteId) return;

		try {
			const { error } = await api.deleteMessage(messageToDeleteId);

			if (error) {
				toast.error("Something went Wrong!");
			}

			toast.success("Message deleted!");
		} catch (err: any) {
			toast.error("Failed to delete message.");
		} finally {
			setShowDeleteModal(false);
			setMessageToDeleteId(null);
			setTimeout(() => {
				location.reload();
			}, 1500);
		}
	};

	//Setter to delete message (Show Modal)
	const confirmDelete = (id: string) => {
		setMessageToDeleteId(id);
		setShowDeleteModal(true);
	};

	// ✅ Added Logic
	useEffect(() => {
		const fetchData = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!session?.user) {
				toast.error("Unauthorized");
				return;
			}

			const user = session.user;
			setCurrentUser(user);

			const { data: allUsers } = await api.getProfile();

			const { data: allRequests } = await api.getFriendsByBothId(user.id);

			const accepted = allRequests?.filter(
				(r) => r.status === "accepted"
			);
			const friendIds = accepted?.map((r) =>
				r.sender_id === user.id ? r.receiver_id : r.sender_id
			);

			const incoming = allRequests?.filter(
				(r) => r.receiver_id === user.id && r.status === "pending"
			);

			const nonFriends = allUsers?.filter(
				(u) =>
					u.id !== user.id &&
					!friendIds?.includes(u.id) &&
					!incoming?.some((r) => r.sender_id === u.id) &&
					!allRequests?.some(
						(r) =>
							(r.sender_id === user.id ||
								r.receiver_id === user.id) &&
							(r.receiver_id === u.id || r.sender_id === u.id) &&
							r.status === "pending"
					)
			);

			const enrichedRequests = incoming?.map((req) => {
				const senderProfile = allUsers?.find(
					(u) => u.id === req.sender_id
				);
				return {
					...req,
					sender_full_name: senderProfile?.full_name || "Unknown",
				};
			});

			const outgoing = allRequests?.filter(
				(r) => r.sender_id === user.id && r.status === "pending"
			);

			const enrichedSentRequests = outgoing?.map((req) => {
				const receiverProfile = allUsers?.find(
					(u) => u.id === req.receiver_id
				);
				return {
					...req,
					receiver_full_name: receiverProfile?.full_name || "Unknown",
					receiver_id: receiverProfile?.id,
				};
			});

			setUsers(nonFriends || []);
			setFriendData({
				friends:
					allUsers?.filter((u) => friendIds?.includes(u.id)) || [],
				requests: enrichedRequests || [],
				sentRequests: enrichedSentRequests || [],
			});

			setLoading(false);
		};

		fetchData();
	}, []);

	//Redirect error page when error is true
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	//Send friend request
	const sendRequest = async (receiver_id: string) => {
		if (!currentUser) return;

		// Optimistically update UI
		const updatedUsers = users.map((user) =>
			user.id === receiver_id ? { ...user, requestSent: true } : user
		);
		setUsers(updatedUsers);

		try {
			const { error } = await api.sentRequest({
				sender_id: currentUser.id,
				receiver_id: receiver_id,
			});

			if (error) throw new Error(error.message);

			toast.success("Friend request sent!");
		} catch (err: any) {
			toast.error("Failed to send friend request.");
		}
	};

	//Cancel friend request and delete in the table
	const cancelRequest = async (receiver_id: string) => {
		if (!currentUser) return;

		try {
			const { data: sentRequests, error: fetchError } =
				await api.cancelRequest({
					currentUserId: currentUser.id,
					receiver_id: receiver_id,
				});

			if (fetchError) throw new Error(fetchError.message);

			if (sentRequests && sentRequests.length > 0) {
				const requestId = sentRequests[0].id;

				const { error: deleteError } = await api.deleteRequest(
					requestId
				);

				if (deleteError) throw new Error(deleteError.message);

				toast.success("Friend request canceled!");

				// Update the UI
				const updatedUsers = users.map((user) =>
					user.id === receiver_id
						? { ...user, requestSent: false }
						: user
				);
				setUsers(updatedUsers);
			} else {
				toast.error("No request found to cancel.");
			}
		} catch (err: any) {
			toast.error("Failed to cancel friend request.");
		}
	};

	const respondToRequest = async (
		id: string,
		status: "accepted" | "rejected"
	) => {
		try {
			if (status === "accepted") {
				const { error } = await api.acceptRequest({ status, id });

				if (error) {
					toast.error(
						"Failed to accept. Please try again or reload the page."
					);
				}

				toast.success("Friend request accepted!");
			} else {
				const { error } = await api.rejectRequest(id);

				if (error) throw new Error(error.message);

				toast.success("Friend request rejected and deleted.");
			}

			setTimeout(() => {
				location.reload();
			}, 1500);
		} catch (err: any) {
			toast.error(
				"Something went wrong. Please try again or reload the page."
			);
		}
	};

	//Blur the input sections when viewing friend secret message
	const cancelViewFriendMessage = () => {
		setIsMyMessage(true);
	};

	//Viewing friend secret messages
	const viewMessages = async (friendId: string) => {
		if (!currentUser) {
			toast.error("You must be logged in to view messages.");
			return;
		}

		const isFriend = friendData.friends.some(
			(friend) => friend.id === friendId
		);

		if (!isFriend) {
			const error = new Error("You are not friends with this person.");
			error.name = "403 Forbidden";
			setError(error);
			return;
		}

		try {
			const { data, error } = await api.getMessageById(friendId);

			if (error) {
				toast.error("Failed to fetch messages.");
				return;
			}

			setFriendMessages(data || []);
			setIsMyMessage(false);
			toast.success("Messages loaded!");
		} catch (err: any) {
			throw err;
		}
	};

	if (loading) return <Loading loading={loading} />;

	return (
		<div className="w-auto mx-auto p-6 space-y-6">
			<h1 className="text-2xl font-bold mb-4">
				👋 Hello, {user?.user_metadata?.full_name}
			</h1>

			{/* View Message */}
			<Messages
				messages={isMyMessage ? messages : friendMessages}
				title={
					isMyMessage
						? "Your Secret Messages"
						: "Friend Secret Messages"
				}
			/>

			{/* View Overwrite Message */}
			<OverwriteMessages
				message={messages}
				newMessage={newMessage}
				editingMessageId={editingMessageId}
				messages={messages}
				setNewMessage={setNewMessage}
				setEditingMessageId={setEditingMessageId}
				handleSaveMessage={handleSaveMessage}
				handleEditMessage={handleEditMessage}
				handleDeleteMessage={confirmDelete}
				disabled={!isMyMessage}
				onGoBack={cancelViewFriendMessage}
			/>

			{/* View confirmation modal */}
			<ConfirmationDeleteModal
				title="delete"
				text="Are you sure you want to delete this message?"
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onConfirm={handleDeleteMessage}
			/>

			{/* View friend list, request and friend secret messages */}
			<Social
				users={users}
				sentRequests={friendData.sentRequests}
				requests={friendData.requests}
				friends={friendData.friends}
				viewedMessages={viewedMessages}
				viewingError={viewingError}
				sendRequest={sendRequest}
				cancelRequest={cancelRequest}
				respondToRequest={respondToRequest}
				viewMessages={viewMessages}
			/>
		</div>
	);
}
