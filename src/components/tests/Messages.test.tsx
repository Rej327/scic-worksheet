import { render, screen } from "@testing-library/react";
import Messages from "@/components/Messages";

describe.only("Messages", () => {
	const messages = [
		{
			id: "1",
			message: "This is the first secret message.",
			updated_at: "2025-04-13 12:03:07.986+00",
		},
		{
			id: "2",
			message: "This is the second secret message.",
			updated_at: "2025-04-13 13:41:19.306+00",
		},
	];

	test("renders the default title when no title is provided", () => {
		render(<Messages messages={messages} />);
		const title = screen.getByText("Your Secret Messages");
		expect(title).toBeInTheDocument();
	});

	test("renders the provided title", () => {
		const customTitle = "Custom Title";
		render(<Messages messages={messages} title={customTitle} />);
		const title = screen.getByText(customTitle);
		expect(title).toBeInTheDocument();
	});

	test("renders the empty message when no messages are provided", () => {
		render(<Messages messages={[]} />);
		const emptyText = screen.getByText(
			"You haven't written any secret messages yet."
		);
		expect(emptyText).toBeInTheDocument();
	});

	test("renders messages correctly", () => {
		render(<Messages messages={messages} />);

		// Check that the message content is rendered
		expect(
			screen.getByText("This is the first secret message.")
		).toBeInTheDocument();
		expect(
			screen.getByText("This is the second secret message.")
		).toBeInTheDocument();
	});

	test("renders the updated_at timestamp when provided", () => {
		render(<Messages messages={messages} />);

		expect(screen.getByText("4/13/2025, 8:03:07 PM")).toBeInTheDocument();
		expect(screen.getByText("4/13/2025, 9:41:19 PM")).toBeInTheDocument();
	});
});
