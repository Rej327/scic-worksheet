import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Social from "@/components/Social";

jest.mock("../IconWithTooltip", () => (props: any) => (
	<button onClick={props.onClick} aria-label={props.text}>
		{props.text}
	</button>
));

describe.only("Social", () => {
	const mockSendRequest = jest.fn();
 const mockCancelRequest = jest.fn();
	const mockRespondToRequest = jest.fn();
	const mockViewMessages = jest.fn();

	const users = [
		{ id: "1", full_name: "Alice" },
		{ id: "2", full_name: "Bob", requestSent: true },
	];

	const sentRequests = [
		{
			id: "req1",
			sender_full_name: "You",
			receiver_full_name: "Charlie",
			receiver_id: "3",
		},
	];

	const requests = [
		{
			id: "req2",
			sender_full_name: "David",
			receiver_full_name: "You",
			receiver_id: "4",
		},
	];

	const friends = [{ id: "5", full_name: "Eve" }];

	const viewedMessages = {
		"1": ["Hi Alice!"],
		"5": ["Hello Eve!"],
	};

  const friendStatus = [
    {
      uuid: "req1",
      id: "1",
      receiver_id: "1",
      sender_id: "2",
      status: 'pending',
    },
  ];

	// Default props for rendering Social component
	const defaultProps = {
		users,
		sentRequests,
		requests,
		friends,
		viewedMessages,
		viewingError: null,
		sendRequest: mockSendRequest,
		cancelRequest: mockCancelRequest,
		respondToRequest: mockRespondToRequest,
		viewMessages: mockViewMessages,
	};

	beforeEach(() => {
		jest.clearAllMocks();
		render(<Social {...defaultProps} />);
	});

	it("renders user suggestions", () => {
		expect(screen.getByText("People You May Know")).toBeInTheDocument();
		expect(screen.getByText("Alice")).toBeInTheDocument();
		expect(screen.getByText("Bob")).toBeInTheDocument();
	});

	it("renders sent requests", () => {
		expect(screen.getByText("Sent Friend Requests")).toBeInTheDocument();
		expect(screen.getByText("Charlie")).toBeInTheDocument();
	});

	it("renders pending requests", () => {
		expect(screen.getByText("Pending Friend Requests")).toBeInTheDocument();
		expect(screen.getByText("David")).toBeInTheDocument();
	});

	it("renders friends list", () => {
		expect(screen.getByText("Your Friends")).toBeInTheDocument();
		expect(screen.getByText("Eve")).toBeInTheDocument();
	});

	it("calls sendRequest on add friend icon click", () => {
		const addIcons = screen.getAllByLabelText("Friend Request");
		fireEvent.click(addIcons[0]);
		expect(mockSendRequest).toHaveBeenCalledWith("1");
	});

	it("calls cancelRequest on cancel icon click", () => {
		const cancelIcons = screen.getAllByLabelText("Cancel Request");

		fireEvent.click(cancelIcons[0]);
		expect(mockCancelRequest).toHaveBeenCalledWith("1");
	});

	it("calls respondToRequest on accept/reject", () => {
		const acceptIcon = screen.getByLabelText("Accept Request");
		const rejectIcon = screen.getByLabelText("Reject Request");

		fireEvent.click(acceptIcon);
		expect(mockRespondToRequest).toHaveBeenCalledWith("req2", "accepted");

		fireEvent.click(rejectIcon);
		expect(mockRespondToRequest).toHaveBeenCalledWith("req2", "rejected");
	});

	it("calls viewMessages on envelope icon click", () => {
		const envelopeIcons = screen.getAllByLabelText("View Secret Message");
		fireEvent.click(envelopeIcons[0]); // Clicking the first "View Secret Message" button
		expect(mockViewMessages).toHaveBeenCalledWith("1");
	});
});
