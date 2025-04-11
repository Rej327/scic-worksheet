"use client";

import { supabase } from "@/helper/connection";
import { useEffect, useState } from "react";

export default function SecretPage3() {
	const [currentUser, setCurrentUser] = useState<any>(null);
	const [users, setUsers] = useState<any[]>([]);
	const [friends, setFriends] = useState<any[]>([]);
	const [requests, setRequests] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [sentRequests, setSentRequests] = useState<any[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!session?.user) {
				alert("Unauthorized");
				return;
			}

			const user = session.user;
			setCurrentUser(user);

			// Fetch all profiles
			const { data: allUsers } = await supabase
				.from("profile")
				.select("*");

			// Fetch friend requests (either sent or received)
			const { data: allRequests } = await supabase
				.from("friend_request")
				.select("*")
				.or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

			// Get accepted friends
			const accepted = allRequests?.filter(
				(r) => r.status === "accepted"
			);
			const friendIds = accepted?.map((r) =>
				r.sender_id === user.id ? r.receiver_id : r.sender_id
			);

			// Get pending requests sent TO the user
			const incoming = allRequests?.filter(
				(r) => r.receiver_id === user.id && r.status === "pending"
			);

			// Determine who are NOT friends and NOT the current user
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

			// Map incoming requests and attach sender full name
			const enrichedRequests = incoming?.map((req) => {
				const senderProfile = allUsers?.find(
					(u) => u.id === req.sender_id
				);
				return {
					...req,
					sender_full_name: senderProfile?.full_name || "Unknown",
				};
			});

			// Get pending requests sent BY the user
			const outgoing = allRequests?.filter(
				(r) => r.sender_id === user.id && r.status === "pending"
			);

			// Map sent requests and attach receiver profile
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

			// Set all states
			setUsers(nonFriends || []);
			setFriends(
				allUsers?.filter((u) => friendIds?.includes(u.id)) || []
			);
			setRequests(enrichedRequests || []);
			setSentRequests(enrichedSentRequests || []);

			setLoading(false);
		};

		fetchData();
	}, []);

	const sendRequest = async (receiver_id: string) => {
		if (!currentUser) return;

		// Update button text state immediately
		const updatedUsers = users.map((user) =>
			user.id === receiver_id
				? { ...user, requestSent: true } // Mark that request is sent
				: user
		);
		setUsers(updatedUsers);

		const { error } = await supabase.from("friend_request").insert([
			{
				sender_id: currentUser.id,
				receiver_id,
			},
		]);

		if (error) {
			alert("Error sending request");
			console.error(error.message);
		} else {
			alert("Friend request sent!");
			// We do NOT reload, just update the button state
		}
	};

	const cancelRequest = async (receiver_id: string) => {
		if (!currentUser) return;

		// Find the request sent by the current user to the receiver
		const { data: sentRequests } = await supabase
			.from("friend_request")
			.select("*")
			.eq("sender_id", currentUser.id)
			.eq("receiver_id", receiver_id)
			.eq("status", "pending");

		if (sentRequests && sentRequests.length > 0) {
			const requestId = sentRequests[0].id;

			// Delete the request from the database
			const { error } = await supabase
				.from("friend_request")
				.delete()
				.eq("id", requestId);

			if (error) {
				alert("Error canceling request");
				console.error(error.message);
			} else {
				alert("Friend request canceled!");
				// Update the UI
				const updatedUsers = users.map((user) =>
					user.id === receiver_id
						? { ...user, requestSent: false } // Mark that the request was canceled
						: user
				);
				setUsers(updatedUsers);
			}
		}
	};

	const respondToRequest = async (
		id: string,
		status: "accepted" | "rejected"
	) => {
		if (status === "accepted") {
			const { error } = await supabase
				.from("friend_request")
				.update({ status })
				.eq("id", id);
	
			if (error) {
				alert("Error accepting request");
				console.error(error.message);
			} else {
				alert("Request accepted");
				location.reload();
			}
		} else if (status === "rejected") {
			const { error } = await supabase
				.from("friend_request")
				.delete()
				.eq("id", id);
	
			if (error) {
				alert("Error rejecting request");
				console.error(error.message);
			} else {
				alert("Request rejected and deleted");
				location.reload();
			}
		}
	};
	

	if (loading) return <p>Loading...</p>;

	return (
		<div className="p-4 max-w-xl mx-auto space-y-6">
			<h1 className="text-2xl font-bold">
				👋 Hello, {currentUser?.user_metadata?.full_name}
			</h1>

			{/* Non-Friends List */}
			<div>
				<h2 className="text-xl font-semibold mb-2">
					People You May Know
				</h2>

				{sentRequests.length === 0
					? null
					: sentRequests.map((req) => (
							<div
								key={req.id}
								className="flex justify-between items-center mb-2 border p-2 rounded"
							>
								<span>{req.receiver_full_name}</span>
								<button
									className="bg-gray-400 text-white px-3 py-1 rounded"
									onClick={() =>
										cancelRequest(req.receiver_id)
									}
								>
									Cancel Request
								</button>
							</div>
					  ))}

				{users.length === 0 ? (
					<p>No users available</p>
				) : (
					users.map((user) => (
						<div
							key={user.id}
							className="flex justify-between items-center mb-2 border p-2 rounded"
						>
							<span>{user.full_name}</span>
							{user.requestSent ? (
								<div className="flex space-x-2">
									<button
										className="bg-gray-400 text-white px-3 py-1 rounded"
										onClick={() => cancelRequest(user.id)}
									>
										Cancel Request
									</button>
								</div>
							) : (
								<button
									className="bg-blue-500 text-white px-3 py-1 rounded"
									onClick={() => sendRequest(user.id)}
								>
									Add Friend
								</button>
							)}
						</div>
					))
				)}
			</div>

			{/* Friend Requests */}
			<div>
				<h2 className="text-xl font-semibold mb-2">
					Pending Friend Requests
				</h2>
				{requests.length === 0 ? (
					<p>No incoming requests</p>
				) : (
					requests.map((req) => (
						<div
							key={req.id}
							className="flex justify-between items-center mb-2 border p-2 rounded"
						>
							<span>{req.sender_full_name}</span>
							<div className="space-x-2">
								<button
									className="bg-green-500 text-white px-3 py-1 rounded"
									onClick={() =>
										respondToRequest(req.id, "accepted")
									}
								>
									Accept
								</button>
								<button
									className="bg-red-500 text-white px-3 py-1 rounded"
									onClick={() =>
										respondToRequest(req.id, "rejected")
									}
								>
									Reject
								</button>
							</div>
						</div>
					))
				)}
			</div>

			{/* Friends List */}
			<div>
				<h2 className="text-xl font-semibold mb-2">Your Friends</h2>
				{friends.length === 0 ? (
					<p>No friends yet</p>
				) : (
					friends.map((friend) => (
						<div
							key={friend.id}
							className="border p-2 rounded mb-2"
						>
							{friend.full_name}
						</div>
					))
				)}
			</div>
		</div>
	);
}
