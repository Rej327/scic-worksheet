import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Auth from "./Auth";

const mockSupabase = {
	auth: {
		signUp: jest.fn(),
		signInWithPassword: jest.fn(),
	},
} as any;

describe.only("Auth", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders login form initially", () => {
		render(<Auth supabase={mockSupabase} />);
		expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
		expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
		expect(screen.getByTestId("submit-button")).toHaveTextContent("Login");
	});

	it("switches to register form", () => {
		render(<Auth supabase={mockSupabase} />);
		const toggleButton = screen.getByText(/Need an account\? Register/i);
		fireEvent.click(toggleButton);
		expect(screen.getByPlaceholderText(/Full Name/i)).toBeInTheDocument();
		expect(screen.getByTestId("submit-button")).toHaveTextContent(
			"Register"
		);
	});

	it("shows validation errors when fields are empty", async () => {
		render(<Auth supabase={mockSupabase} />);
		const submitButton = screen.getByTestId("submit-button");
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText("* Email is required.")
			).toBeInTheDocument();
			expect(
				screen.getByText("* Password is required.")
			).toBeInTheDocument();
		});
	});

	it("shows loading spinner when submitting", async () => {
		mockSupabase.auth.signInWithPassword.mockResolvedValue({ error: null });

		render(<Auth supabase={mockSupabase} />);
		fireEvent.change(screen.getByPlaceholderText(/Email/i), {
			target: { value: "test@example.com" },
		});
		fireEvent.change(screen.getByPlaceholderText(/Password/i), {
			target: { value: "123456" },
		});
		fireEvent.click(screen.getByTestId("submit-button"));

		await waitFor(() => {
			const buttonText = screen.getByTestId("submit-button");
			expect(buttonText).toHaveTextContent("Please wait...");
		});
	});
});
