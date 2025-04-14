"use client";

export default function Error({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	return (
		<div className="flex justify-center items-center h-screen bg-[#D5F0CE]">
			<div className="text-center p-8 bg-white rounded shadow-md">
				<h1 className="text-4xl font-bold text-red-500">
					{`${error.name} !!!` || "Oops !!!"}
				</h1>
				<p className="mt-4 text-xl">
					{error.message ||
						"Something went wrong. Please try again later."}
				</p>
				<button
					className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 duration-150 cursor-pointer"
					onClick={() => reset()}
				>
					Try Again
				</button>
			</div>
		</div>
	);
}
