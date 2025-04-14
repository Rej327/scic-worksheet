import { render, screen, fireEvent } from "@testing-library/react";
import OverwriteMessages from "@/components/OverwriteMessages";

describe.only("OverwriteMessages", () => {
	const mockMessages = [
		{ id: "1", message: "First secret message" },
		{ id: "2", message: "Second secret message" },
	];

	const defaultProps = {
		newMessage: "",
		editingMessageId: null,
		message: mockMessages,
		messages: mockMessages,
		setNewMessage: jest.fn(),
		setEditingMessageId: jest.fn(),
		handleSaveMessage: jest.fn(),
		handleEditMessage: jest.fn(),
		handleDeleteMessage: jest.fn(),
		disabled: false,
		onGoBack: jest.fn(),
	};

	afterEach(() => {
		jest.clearAllMocks();
	});

	test("renders correctly with default props", () => {
		render(<OverwriteMessages {...defaultProps} />);

		expect(screen.getByText("Write a Secret Message")).toBeInTheDocument();
		expect(
			screen.getByPlaceholderText("Write your secret message...")
		).toBeInTheDocument();
		expect(screen.getByText("Save Message")).toBeInTheDocument();
		expect(
			screen.getByText("Tap to Edit Your Previous Messages")
		).toBeInTheDocument();
		expect(screen.getByText("First secret message")).toBeInTheDocument();
		expect(screen.getByText("Second secret message")).toBeInTheDocument();
	});

	test("calls setNewMessage when textarea changes", () => {
		render(<OverwriteMessages {...defaultProps} />);
		const textarea = screen.getByPlaceholderText(
			"Write your secret message..."
		);

		fireEvent.change(textarea, { target: { value: "New text" } });
		expect(defaultProps.setNewMessage).toHaveBeenCalledWith("New text");
	});

	test("calls handleSaveMessage when Save button is clicked", () => {
		render(
			<OverwriteMessages {...defaultProps} newMessage="Some message" />
		);
		const saveButton = screen.getByText("Save Message");

		fireEvent.click(saveButton);
		expect(defaultProps.handleSaveMessage).toHaveBeenCalled();
	});

	test("disables Save button when newMessage is empty", () => {
		render(<OverwriteMessages {...defaultProps} newMessage="" />);
		const saveButton = screen.getByText("Save Message");
		expect(saveButton).toBeDisabled();
	});

	test("renders Update Message and Cancel buttons when editing", () => {
		render(
			<OverwriteMessages
				{...defaultProps}
				editingMessageId="1"
				newMessage="Edit this"
			/>
		);
		expect(screen.getByText("Update Message")).toBeInTheDocument();
		expect(screen.getByText("Cancel")).toBeInTheDocument();
	});

	test("calls setEditingMessageId and setNewMessage on cancel", () => {
		render(
			<OverwriteMessages
				{...defaultProps}
				editingMessageId="1"
				newMessage="Edit this"
			/>
		);
		const cancelButton = screen.getByText("Cancel");

		fireEvent.click(cancelButton);
		expect(defaultProps.setEditingMessageId).toHaveBeenCalledWith(null);
		expect(defaultProps.setNewMessage).toHaveBeenCalledWith("");
	});

	test("calls handleEditMessage and handleDeleteMessage when buttons clicked", () => {
		render(<OverwriteMessages {...defaultProps} />);

		const editButtons = screen.getAllByText("Edit");
		const deleteButtons = screen.getAllByText("Delete");

		fireEvent.click(editButtons[0]);
		fireEvent.click(deleteButtons[1]);

		expect(defaultProps.handleEditMessage).toHaveBeenCalledWith(
			"1",
			"First secret message"
		);
		expect(defaultProps.handleDeleteMessage).toHaveBeenCalledWith("2");
	});

	test("shows overlay with Go Back button when disabled is true", () => {
		render(<OverwriteMessages {...defaultProps} disabled={true} />);
		const goBackButton = screen.getByText("Go Back");

		expect(goBackButton).toBeInTheDocument();

		fireEvent.click(goBackButton);
		expect(defaultProps.onGoBack).toHaveBeenCalled();
	});

	test("renders empty state when messages is empty", () => {
		render(<OverwriteMessages {...defaultProps} messages={[]} />);
		expect(screen.getByText("No messages to edit.")).toBeInTheDocument();
	});
});
