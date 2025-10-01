import React from "react";

interface NavigationLinkProps {
	href: string;
	children: React.ReactNode;
	className?: string;
	onClick?: () => void;
}

export const NavigationLink: React.FC<NavigationLinkProps> = ({
	href,
	children,
	className = "",
	onClick,
}) => {
	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		e.stopPropagation();

		if (href.startsWith("#")) {
			const elementId = href.substring(1);

			const element = document.getElementById(elementId);
			if (element) {
				const targetPosition = element.offsetTop - 80;
				const startPosition = window.pageYOffset;
				const distance = targetPosition - startPosition;
				const duration = 800;

				let startTime: number | null = null;

				const animate = (currentTime: number) => {
					if (startTime === null) startTime = currentTime;
					const timeElapsed = currentTime - startTime;
					const progress = Math.min(timeElapsed / duration, 1);

					// Smooth easing function
					const ease =
						progress < 0.5
							? 4 * progress * progress * progress
							: (progress - 1) *
									(2 * progress - 2) *
									(2 * progress - 2) +
							  1;

					const currentPos = startPosition + distance * ease;
					window.scrollTo(0, currentPos);

					if (timeElapsed < duration) {
						requestAnimationFrame(animate);
					}
				};

				requestAnimationFrame(animate);

				// Update URL without page reload
				window.history.pushState(null, "", href);
			}
		} else if (href.startsWith("/")) {
			// Handle internal routes
			window.location.href = href;
		}

		if (onClick) {
			onClick();
		}
	};

	return (
		<a href={href} className={className} onClick={handleClick}>
			{children}
		</a>
	);
};
