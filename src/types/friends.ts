export interface SentRequestProps {
	sender_id: string;
	receiver_id: string;
}

export interface FindRequestProps {
	currentUserId: string;
	receiver_id: string;
}

export interface FriendRequestProps {
	id: string;
	status: string;
}

export interface RequestProps {
  id: string;
  sender_full_name: string;
  receiver_full_name: string;
  receiver_id: string;
}

export interface FriendRequestStatusProps {
	id: string;
	full_name: string;
	user: string;
	isFriend: boolean;
	sender_full_name: string;
	receiver_full_name: string;
	receiver_id: string;
}