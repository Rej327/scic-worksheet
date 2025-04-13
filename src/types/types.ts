export interface Message {
	id: string;
	message: string;
}

export interface ConfirmationModalProps {
	text: string;
	title: string;
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export interface CreateMessageProps {
	user_id: string;
	message: string;
	updated_at: string;
}

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
