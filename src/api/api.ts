import {
	cancelRequest,
	deleteRequest,
	getFriendsByBothId,
	sentRequest,
} from "./friends";
import {
	createMessage,
	deleteMessage,
	getMessageById,
	updateMessage,
} from "./message";
import { getProfile } from "./profile";
import { acceptRequest, rejectRequest } from "./respondRequest";

export default {
	// messages
	getMessageById,
	updateMessage,
	createMessage,
	deleteMessage,

	//friends
	getFriendsByBothId,
	sentRequest,
	cancelRequest,
	deleteRequest,

	// respond request
	acceptRequest,
	rejectRequest,

	//profile
	getProfile,
};
