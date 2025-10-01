import { useCallback, useEffect, useState, type MouseEvent } from "react";
import {
	AnimatePresence,
	motion,
	useMotionTemplate,
	useMotionValue,
	type MotionStyle,
	type MotionValue,
	type Variants,
} from "framer-motion";
import { Clock } from "lucide-react";

// --- Helper Functions and Fallbacks ---

// A simple utility for class names, similar to cn/clsx
const cn = (...classes: (string | boolean | undefined)[]) => {
	return classes.filter(Boolean).join(" ");
};

// --- Types ---

type WrapperStyle = MotionStyle & {
	"--x": MotionValue<string>;
	"--y": MotionValue<string>;
};

interface CardProps {
	bgClass?: string;
}

interface ServiceCategory {
	id: string;
	name: string;
}

interface FeatureCarouselProps extends CardProps {
	categories: ServiceCategory[];
	allServices: { [key: string]: Step[] };
}

interface Step {
	id: string;
	name: string;
	title: string;
	description: string;
	duration_minutes?: number;
}

// --- Hooks ---
function useNumberCycler(totalSteps: number, interval: number = 5000) {
	const [currentNumber, setCurrentNumber] = useState(0);

	useEffect(() => {
		const timerId = setTimeout(() => {
			setCurrentNumber((prev) => (prev + 1) % totalSteps);
		}, interval);
		return () => clearTimeout(timerId);
	}, [currentNumber, totalSteps, interval]);

	const setStep = useCallback(
		(stepIndex: number) => {
			setCurrentNumber(stepIndex % totalSteps);
		},
		[totalSteps]
	);

	return { currentNumber, setStep };
}

function useIsMobile() {
	const [isMobile, setIsMobile] = useState(false);
	useEffect(() => {
		const checkDevice = () => {
			setIsMobile(window.matchMedia("(max-width: 768px)").matches);
		};
		checkDevice();
		window.addEventListener("resize", checkDevice);
		return () => window.removeEventListener("resize", checkDevice);
	}, []);
	return isMobile;
}

// --- Components ---
const stepVariants: Variants = {
	inactive: { scale: 0.9, opacity: 0.7 },
	active: { scale: 1, opacity: 1 },
};

interface FeatureCardProps {
	children: React.ReactNode;
}

function FeatureCard({ children }: FeatureCardProps) {
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);
	const isMobile = useIsMobile();
	function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
		if (isMobile) return;
		const { left, top } = currentTarget.getBoundingClientRect();
		mouseX.set(clientX - left);
		mouseY.set(clientY - top);
	}
	return (
		<motion.div
			className="animated-cards group relative w-full rounded-2xl"
			onMouseMove={handleMouseMove}
			style={
				{
					"--x": useMotionTemplate`${mouseX}px`,
					"--y": useMotionTemplate`${mouseY}px`,
				} as WrapperStyle
			}
		>
			<div className="relative w-full overflow-hidden rounded-3xl bg-transparent transition-colors duration-300">
				<div className="min-h-[310px] w-full relative">
					{/* Miejsce na siatkę usług */}
					{children}
				</div>
			</div>
		</motion.div>
	);
}

function StepsNav({
	steps: stepItems,
	current,
	onChange,
}: {
	steps: readonly Step[];
	current: number;
	onChange: (index: number) => void;
}) {
	return (
		<nav aria-label="Progress" className="flex justify-center px-4 mb-8">
			<ol
				className="flex w-full flex-wrap items-center justify-center gap-6"
				role="list"
			>
				{stepItems.map((step, stepIdx) => {
					const isCurrent = current === stepIdx;
					return (
						<motion.li
							key={step.name}
							initial="inactive"
							animate={isCurrent ? "active" : "inactive"}
							variants={stepVariants}
							transition={{ duration: 0.3 }}
							className="relative"
						>
							<button
								type="button"
								className={cn(
									"group relative flex items-center gap-3 rounded-full px-8 py-4 text-lg font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500 dark:focus-visible:ring-offset-black",
									isCurrent
										? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-xl scale-105 border-0"
										: "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-lg hover:scale-102 border border-gray-200"
								)}
								onClick={() => onChange(stepIdx)}
							>
								{isCurrent ? (
									<motion.span
										key={step.name}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.3 }}
										className="text-xl font-bold tracking-wide text-white whitespace-nowrap"
									>
										{step.name}
									</motion.span>
								) : (
									<span className="text-xl font-bold tracking-wide whitespace-nowrap">
										{step.name}
									</span>
								)}
							</button>
						</motion.li>
					);
				})}
			</ol>
		</nav>
	);
}

export function FeatureCarousel({
	categories,
	allServices,
}: FeatureCarouselProps) {
	const { currentNumber: currentCategoryIndex, setStep } = useNumberCycler(
		categories.length
	);
	const currentCategory = categories[currentCategoryIndex];
	const currentServices = allServices[currentCategory.id] || [];

	return (
		<div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
			{/* Przyciski nawigacji kategorii na górze */}
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
			>
				<StepsNav
					current={currentCategoryIndex}
					onChange={setStep}
					steps={categories.map((cat) => ({
						id: cat.id,
						name: cat.name,
						title: cat.name,
						description: "",
					}))}
				/>
			</motion.div>

			{/* Główny komponent z siatką usług */}
			<FeatureCard>
				<AnimatePresence mode="wait">
					<motion.div
						key={currentCategoryIndex}
						className="grid grid-cols-2 gap-6 w-full h-full p-8"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
					>
						{currentServices.slice(0, 4).map((service, index) => {
							// Określamy kierunek animacji na podstawie pozycji w siatce
							const isLeftSide = index % 2 === 0; // indeksy 0, 2 to lewa strona
							const animationDirection = isLeftSide
								? { x: -50 }
								: { x: 50 };

							return (
								<motion.div
									key={service.id}
									className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg"
									initial={{
										opacity: 0,
										...animationDirection,
									}}
									animate={{ opacity: 1, x: 0 }}
									transition={{
										delay: index * 0.15, // Zwiększone opóźnienie: 0s, 0.15s, 0.3s, 0.45s
										duration: 0.8, // Dłuższy czas animacji dla "powolnego wsuwania"
										ease: [0.25, 0.46, 0.45, 0.94], // Bardziej elegancka krzywa easing
									}}
								>
									<h3 className="text-lg font-bold text-neutral-800 mb-3">
										{service.title}
									</h3>
									<p className="text-sm text-neutral-600 leading-relaxed">
										{service.description}
									</p>
									{service.duration_minutes &&
										service.duration_minutes > 0 && (
											<div className="flex items-center gap-2 mt-3 text-xs font-medium text-blue-600">
												<span className="inline-flex items-center gap-1 rounded-full bg-blue-50/90 px-2.5 py-1">
													<Clock className="h-3.5 w-3.5" />
													{service.duration_minutes}{" "}
													min
												</span>
											</div>
										)}
								</motion.div>
							);
						})}
					</motion.div>
				</AnimatePresence>
			</FeatureCard>
		</div>
	);
}
