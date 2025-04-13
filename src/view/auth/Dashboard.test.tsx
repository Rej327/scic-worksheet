import { render, screen, waitFor } from "@testing-library/react";
import { createClient } from "@supabase/supabase-js";
import Dashboard from "./Dashboard";

// Create a mocked Supabase client
const mockSupabase = createClient("http://localhost", "public-anon-key");

jest.mock("@supabase/supabase-js", () => {
	const actual = jest.requireActual("@supabase/supabase-js");
	return {
		...actual,
		createClient: jest.fn(() => ({
			auth: {
				getUser: jest.fn(() =>
					Promise.resolve({
						data: { user: { id: "1", email: "test@example.com" } },
					})
				),
			},
		})),
	};
});

describe.only("Dashboard", () => {
	it("renders all secret pages", async () => {
		render(<Dashboard supabase={mockSupabase} />);

		await waitFor(() => {
			expect(screen.getByText("Messages")).toBeInTheDocument();
			expect(screen.getByText("Overwrite Messages")).toBeInTheDocument();
			expect(screen.getByText("Socials")).toBeInTheDocument();
		});
	});
});
