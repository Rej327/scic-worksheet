import React from "react";

export default function Loading({ loading }: { loading: boolean }) {
	if (!loading) return null;

	return (
		<div className="text-center mt-10 text-gray-500">
			<span className="animate-pulse">Loading...</span>
		</div>
	);
}
