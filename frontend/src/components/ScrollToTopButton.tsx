import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

export const ScrollToTopButton: React.FC = () => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const toggleVisibility = () => {
			if (window.pageYOffset > 300) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		window.addEventListener("scroll", toggleVisibility);
		return () => window.removeEventListener("scroll", toggleVisibility);
	}, []);

	const handleScrollToTop = () => {
		const startPosition = window.pageYOffset;
		const duration = 600;
		let startTime: number | null = null;

		const animate = (currentTime: number) => {
			if (startTime === null) startTime = currentTime;
			const timeElapsed = currentTime - startTime;
			const progress = Math.min(timeElapsed / duration, 1);

			// Smooth easing function
			const ease =
				progress < 0.5
					? 4 * progress * progress * progress
					: (progress - 1) * (2 * progress - 2) * (2 * progress - 2) +
					  1;

			const currentPos = startPosition * (1 - ease);
			window.scrollTo(0, currentPos);

			if (timeElapsed < duration) {
				requestAnimationFrame(animate);
			}
		};

		requestAnimationFrame(animate);
	};

	if (!isVisible) {
		return null;
	}

	return (
		<button
			onClick={handleScrollToTop}
			className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
			aria-label="Przewiń do góry"
		>
			<ChevronUp className="w-6 h-6" />
		</button>
	);
};
