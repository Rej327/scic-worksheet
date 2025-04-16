// export interface Message {
// 	id: string;
// 	message: string;
// }

export interface MessageProps {
	id: string; 
	message: string;
	updated_at?: string;
}

export interface MessagesProps {
	messages: MessageProps[];
	title?: string;
	emptyText?: string;
}

export interface CreateMessageProps {
	user_id: string;
	message: string;
	updated_at: string;
}

export interface OverwriteMessagesProps {
	message: MessageProps[];
	newMessage: string;
	editingMessageId: string | null;
	messages: MessageProps[];
	setNewMessage: (value: string) => void;
	setEditingMessageId: (id: string | null) => void;
	handleSaveMessage: () => void;
	handleEditMessage: (id: string, message: string) => void;
	handleDeleteMessage: (id: string) => void;
	disabled?: boolean;
	onGoBack?: () => void;
}
