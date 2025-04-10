import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "SCIC Worksheet",
	description:
		"Evaluation that intended to gauge skills and proficiency as they relate to the role requirements.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="antialiased">{children}</body>
		</html>
	);
}
