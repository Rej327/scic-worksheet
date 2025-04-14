import { RequestProps } from "./friends";
import { User } from "./user";

export interface SocialProps {
  users: User[];
  sentRequests: RequestProps[];
  requests: RequestProps[];
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