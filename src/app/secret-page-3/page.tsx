"use client";

import Messages from "@/components/Messages";
import OverwriteMessages from "@/components/OverwriteMessages";
import { supabase } from "@/helper/connection";
import Loading from "@/helper/Loading";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SecretPage3() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [viewedMessages, setViewedMessages] = useState<{
    [key: string]: string[];
  }>({});
  const [viewingError, setViewingError] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [friendMessages, setFriendMessages] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [isMyMessage, setIsMyMessage] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      //   setLoading(true);
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
      const { data: allUsers } = await supabase.from("profile").select("*");

      // Fetch friend requests (either sent or received)
      const { data: allRequests } = await supabase
        .from("friend_request")
        .select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      //Get current user message
      const { data: userMessage, error } = await supabase
        .from("secret_messages")
        .select("*")
        .eq("user_id", user.id);

      // Get accepted friends
      const accepted = allRequests?.filter((r) => r.status === "accepted");
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
              (r.sender_id === user.id || r.receiver_id === user.id) &&
              (r.receiver_id === u.id || r.sender_id === u.id) &&
              r.status === "pending"
          )
      );

      // Map incoming requests and attach sender full name
      const enrichedRequests = incoming?.map((req) => {
        const senderProfile = allUsers?.find((u) => u.id === req.sender_id);
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
        const receiverProfile = allUsers?.find((u) => u.id === req.receiver_id);
        return {
          ...req,
          receiver_full_name: receiverProfile?.full_name || "Unknown",
          receiver_id: receiverProfile?.id,
        };
      });

      // Set all states
      setMessages(userMessage || []);
      setUsers(nonFriends || []);
      setFriends(allUsers?.filter((u) => friendIds?.includes(u.id)) || []);
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

  const viewMessages = async (friendId: string) => {
    if (!currentUser) {
      console.warn("⚠️ No current user.");
      return;
    }

    const isFriend = friends.some((friend) => friend.id === friendId);

    if (!isFriend) {
      // Throw 403 and redirect to custom page
      router.push("/403-forbidden"); // 👈 Make sure this route exists
      throw new Error("403: Forbidden - Not a friend");
    }

    try {
      const { data, error } = await supabase
        .from("secret_messages")
        .select("*")
        .eq("user_id", friendId);

      if (error) {
        console.error("❌ Supabase Fetch Error:", error);
        return;
      }

      setFriendMessages(data || []);
      setIsMyMessage(false);
    } catch (err) {
      console.error("🚨 Unexpected Error:", err);
    }
  };

  const handleSaveMessage = async () => {
    if (!user) return;

    const messageToSave = {
      user_id: user.id,
      message: newMessage,
    };

    let saveError;

    if (editingMessageId) {
      const { error } = await supabase
        .from("secret_messages")
        .update({ message: newMessage })
        .eq("id", editingMessageId);
      saveError = error;
    } else {
      const { error } = await supabase
        .from("secret_messages")
        .upsert(messageToSave);
      saveError = error;
    }

    if (saveError) {
      console.error("Error saving message:", saveError.message);
    } else {
      alert("Secret message saved!");
      location.reload(); // consider using re-fetch instead
    }
  };

  const handleEditMessage = (id: string, text: string) => {
    setEditingMessageId(id);
    setNewMessage(text);
  };

  const handleDeleteMessage = async (id: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
      const { error } = await supabase
        .from("secret_messages")
        .delete()
        .eq("id", id);
      if (error) {
        console.error("Delete error:", error.message);
      } else {
        alert("Message deleted");
        location.reload(); // consider using re-fetch instead
      }
    }
  };

  const cancelViewFriendMessage = () => {
    setIsMyMessage(true);
  };

	if (loading) return <Loading loading={loading} />

  return (
    <div className="p-4 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">
        👋 Hello, {currentUser?.user_metadata?.full_name}
      </h1>

      <Messages
        messages={isMyMessage ? messages : friendMessages}
        title={isMyMessage ? "Your Secret Messages" : "Friend Secret Messages"}
      />

      {isMyMessage ? (
        <OverwriteMessages
          message={message ?? ""}
          newMessage={newMessage}
          editingMessageId={editingMessageId}
          messages={messages}
          setNewMessage={setNewMessage}
          setEditingMessageId={setEditingMessageId}
          handleSaveMessage={handleSaveMessage}
          handleEditMessage={handleEditMessage}
          handleDeleteMessage={handleDeleteMessage}
        />
      ) : (
        <button
          onClick={cancelViewFriendMessage}
          className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          View Your Message
        </button>
      )}

      {/* Non-Friends List */}
      <div>
        <h2 className="text-xl font-semibold mb-2">People You May Know</h2>

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
                  onClick={() => cancelRequest(req.receiver_id)}
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
              className="flex flex-col gap-2 border p-2 rounded mb-2"
            >
              <div className="flex justify-between items-center">
                <span>{user.full_name}</span>
                {user.requestSent ? (
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
              <button
                className="bg-purple-500 text-white px-3 py-1 rounded w-fit"
                onClick={() => viewMessages(user.id)}
              >
                View Messages
              </button>

              {viewedMessages[user.id] &&
                viewedMessages[user.id].length > 0 && (
                  <div className="bg-gray-100 p-2 rounded">
                    <h4 className="font-semibold">Messages:</h4>
                    <ul className="list-disc ml-4">
                      {viewedMessages[user.id].map((msg, idx) => (
                        <li key={idx}>{msg}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {viewingError && <p className="text-red-500">{viewingError}</p>}
            </div>
          ))
        )}
      </div>

      {/* Friend Requests */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Pending Friend Requests</h2>
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
                  onClick={() => respondToRequest(req.id, "accepted")}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => respondToRequest(req.id, "rejected")}
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
              className="border p-2 rounded mb-2 flex flex-col gap-2"
            >
              <span>{friend.full_name}</span>
              <button
                className="bg-purple-500 text-white px-3 py-1 rounded w-fit"
                onClick={() => viewMessages(friend.id)}
              >
                View Messages
              </button>

              {viewedMessages[friend.id] &&
                viewedMessages[friend.id].length > 0 && (
                  <div className="bg-gray-100 p-2 rounded">
                    <h4 className="font-semibold">Messages:</h4>
                    <ul className="list-disc ml-4">
                      {viewedMessages[friend.id].map((msg, idx) => (
                        <li key={idx}>{msg}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {viewingError && <p className="text-red-500">{viewingError}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
