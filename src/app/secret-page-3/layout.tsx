import Navigation from "@/components/Navigation";

export const metadata = {
	title: "Secret Page 3 | Friends ",
	description: "Secret Page App)",
};

export default function layout({ children }: { children: React.ReactNode }) {
	return <Navigation>{children}</Navigation>;
}
