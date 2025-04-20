import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dashboard from "./Dashboard";

// Mock next/link to avoid issues with <Link>
jest.mock("next/link", () => {
	return ({ children }: { children: React.ReactNode }) => children;
});

describe.only("Dashboard", () => {
	it("renders all secret pages with correct titles", () => {
		render(<Dashboard />);

		const titles = ["Messages", "Overwrite Messages", "Socials"];

		titles.forEach((title) => {
			expect(screen.getByText(title)).toBeInTheDocument();
		});
	});
});
