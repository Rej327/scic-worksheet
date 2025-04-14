"use client";

//Can implement Custom Error Handler but choose the ErrorBoundaryHandler
export default function Error({ reset }: { reset: () => void }) {
	return (
		<div className="flex bg-[#D5F0CE]">
			<div className="text-center p-8 bg-white rounded shadow-md">
				<h1 className="text-4xl font-bold text-red-500">
					Error 403: Forbidden
				</h1>
				<p className="mt-4 text-xl">
					You are not friends with this person.
				</p>
				<button
					className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 duration-150 cursor-pointer"
					onClick={reset}
				>
					Try Again
				</button>
			</div>
		</div>
	);
}
