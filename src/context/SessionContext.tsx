"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { supabase } from "@/helper/connection";
import { getUserById, saveNewUser } from "@/api/user";

interface SessionContextType {
	session: any;
	userId: string | null;
	fullName: string;
	loading: boolean;
}

const SessionContext = createContext<SessionContextType>({
	session: null,
	userId: null,
	fullName: "",
	loading: true,
});

export const SessionProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [session, setSession] = useState<any>(null);
	const [userId, setUserId] = useState<string | null>(null);
	const [fullName, setFullName] = useState("");
	const [loading, setLoading] = useState(true);

	const saveProfile = useCallback(async (user: any) => {
		const userId = user.id;
		const userFullName = user.user_metadata?.full_name ?? "";

		setFullName(userFullName);
		setUserId(userId);

		try {
			// Check if user profile exists
			const { data, error } = await getUserById(userId);

			if (error && error.code !== "PGRST116") {
				console.error("Error checking profile:", error.message);
				return;
			}

			// Save new profile if it doesn't exist
			if (!data) {
				const { error: upsertError } = await saveNewUser({
					id: userId,
					userFullName,
				});

				if (upsertError) {
					console.error("Error saving profile:", upsertError.message);
				} else {
					console.log("✅ Profile saved");
				}
			} else {
				console.log("⚠️ Profile already exists");
			}
		} catch (err) {
			console.error("Error in saveProfile:", err);
		}
	}, []);

	useEffect(() => {
		const initializeSession = async () => {
			try {
				// Fetch the current session
				const { data } = await supabase.auth.getSession();
				const currentSession = data.session;

				if (!currentSession) {
					// Redirect to login only if not already on the login page
					if (window.location.pathname !== "/") {
						window.location.href = "/";
					}
					setLoading(false); // Prevent infinite loading when session is null
					return;
				}

				setSession(currentSession);
				if (currentSession?.user) {
					await saveProfile(currentSession.user);
				}
			} catch (err) {
				console.error("Error fetching session:", err);
			} finally {
				// Stop the loading state regardless of session existence
				setLoading(false);
			}
		};

		initializeSession();

		// Listen for auth state changes
		const { data: listener } = supabase.auth.onAuthStateChange(
			async (_event, session) => {
				setSession(session);

				// Redirect to login on logout or token refresh failure
				if (!_event || _event === "SIGNED_OUT") {
					if (window.location.pathname !== "/") {
						window.location.href = "/";
					}
					return;
				}

				if (session?.user) {
					await saveProfile(session.user);
				}
			}
		);

		// Cleanup listener on unmount
		return () => listener.subscription.unsubscribe();
	}, [saveProfile]);

	return (
		<SessionContext.Provider value={{ session, userId, fullName, loading }}>
			{!loading && children}
			{loading && <div>Loading...</div>}
		</SessionContext.Provider>
	);
};

export const useSession = () => {
	return useContext(SessionContext);
};