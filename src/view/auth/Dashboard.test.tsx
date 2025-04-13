import { render, screen, waitFor } from "@testing-library/react";
import { SupabaseClient } from "@supabase/supabase-js";
import Dashboard from "./Dashboard";

// Mocked Supabase client
const mockSupabase = {
	auth: {
		getUser: jest.fn(),
	},
} as unknown as SupabaseClient;

describe.only("Dashboard", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders secret pages when user is present", async () => {
		mockSupabase.auth.getUser = jest.fn().mockResolvedValue({
			data: { user: { id: "123", email: "test@example.com" } },
			error: null,
		});

		render(<Dashboard supabase={mockSupabase} />);

		await waitFor(() => {
			expect(screen.getByText("Messages")).toBeInTheDocument();
			expect(screen.getByText("Overwrite Messages")).toBeInTheDocument();
			expect(screen.getByText("Socials")).toBeInTheDocument();
		});
	});

	it("handles Supabase error", async () => {
		console.error = jest.fn(); // silence error in test output
		mockSupabase.auth.getUser = jest.fn().mockResolvedValue({
			data: null,
			error: { message: "Supabase error" },
		});

		render(<Dashboard supabase={mockSupabase} />);

		await waitFor(() => {
			expect(console.error).toHaveBeenCalledWith(
				"Error fetching user:",
				"Supabase error"
			);
		});
	});
});
