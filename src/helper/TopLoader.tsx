'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import '@/styles/nprogress.css';

NProgress.configure({ showSpinner: false });

export default function TopLoader() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		NProgress.start();

		// Slight delay to avoid flashing
		const timeout = setTimeout(() => {
			NProgress.done();
		}, 500);

		return () => {
			clearTimeout(timeout);
		};
	}, [pathname, searchParams]);

	return null;
}
