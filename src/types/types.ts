import { ReactNode } from "react";

export interface User {
	id: string;
	full_name: string;
	requestSent?: boolean;
}

export interface Request {
	id: string;
	sender_full_name: string;
	receiver_full_name: string;
	receiver_id: string;
}

export interface SocialProps {
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

export interface OverwriteMessagesProps {
	message: Message[];
	newMessage: string;
	editingMessageId: string | null;
	messages: Message[];
	setNewMessage: (value: string) => void;
	setEditingMessageId: (id: string | null) => void;
	handleSaveMessage: () => void;
	handleEditMessage: (id: string, message: string) => void;
	handleDeleteMessage: (id: string) => void;
	disabled?: boolean;
	onGoBack?: () => void;
}

export interface NavItemProps {
	href: string;
	label: string;
	icon: ReactNode;
}

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
