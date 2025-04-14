import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Navigation from "../Navigation";
import { supabase } from "@/helper/connection";
import { usePathname, useRouter } from "next/navigation";
import "@testing-library/jest-dom";

// Mocks
jest.mock("next/navigation", () => ({
	usePathname: jest.fn(),
	useRouter: jest.fn(),
}));

jest.mock("@/helper/connection", () => ({
	supabase: {
		auth: {
			signOut: jest.fn(),
			getUser: jest.fn(() =>
				Promise.resolve({ data: { user: { id: "123" } }, error: null })
			),
			admin: {
				deleteUser: jest.fn(() => Promise.resolve({ error: null })),
			},
		},
	},
}));

describe("Navigation", () => {
	const pushMock = jest.fn();

	beforeEach(() => {
		(useRouter as jest.Mock).mockReturnValue({ push: pushMock });
		(usePathname as jest.Mock).mockReturnValue("/");
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("renders all navigation links", () => {
		render(
			<Navigation>
				<div>Test Content</div>
			</Navigation>
		);
		expect(screen.getByText("Dashboard")).toBeInTheDocument();
		expect(screen.getByText("My Messages")).toBeInTheDocument();
		expect(screen.getByText("Overwrite Msgs")).toBeInTheDocument();
		expect(screen.getByText("Socials")).toBeInTheDocument();
	});

	it("opens logout modal when Logout is clicked", () => {
		render(
			<Navigation>
				<div>Test</div>
			</Navigation>
		);
		fireEvent.click(screen.getByText("Logout"));
		expect(
			screen.getByText(/are you sure you want to logout/i)
		).toBeInTheDocument();
	});

	it("opens delete modal when Delete Account is clicked", () => {
		render(
			<Navigation>
				<div>Test</div>
			</Navigation>
		);
		fireEvent.click(screen.getByText("Delete Account"));
		expect(
			screen.getByText(/are you sure you want to delete/i)
		).toBeInTheDocument();
	});

	it("redirects when a nav link is clicked (My Messages)", async () => {
		render(
			<Navigation>
				<div>Test</div>
			</Navigation>
		);

		const navLink = screen.getByText("My Messages");
		expect(navLink).toBeInTheDocument();

		fireEvent.click(navLink);

		await waitFor(() => {
			expect(pushMock).not.toHaveBeenCalled();
			expect(navLink.closest("a")).toHaveAttribute(
				"href",
				"/secret-page-1"
			);
		});
	});

	it("logs out the user when logout is confirmed", async () => {
		render(
			<Navigation>
				<div>Test</div>
			</Navigation>
		);
		fireEvent.click(screen.getByText("Logout"));
		fireEvent.click(screen.getByText("Yes"));

		await waitFor(() => {
			expect(supabase.auth.signOut).toHaveBeenCalled();
			expect(pushMock).toHaveBeenCalledWith("/");
		});
	});

	it("deletes the user when delete is confirmed", async () => {
		render(
			<Navigation>
				<div>Test</div>
			</Navigation>
		);
		fireEvent.click(screen.getByText("Delete Account"));
		fireEvent.click(screen.getByText("Yes"));

		await waitFor(() => {
			expect(supabase.auth.admin.deleteUser).toHaveBeenCalledWith("123");
			expect(supabase.auth.signOut).toHaveBeenCalled();
		});
	});
});
