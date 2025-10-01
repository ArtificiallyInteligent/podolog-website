import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Shield, Stethoscope, Zap, Sparkles } from "lucide-react";

interface Service {
	id: number;
	name: string;
	description: string | null;
	price: number;
	duration_minutes: number;
	is_active: boolean;
	category_id: number;
}

interface ServiceCategory {
	id: number;
	name: string;
	description?: string | null;
}

interface ServicesByCategoryItem {
	category: ServiceCategory;
	services: Service[];
}

interface PricingSectionProps {
	servicesByCategory: ServicesByCategoryItem[];
	isLoading: boolean;
}

// Helper do formatowania ceny
const formatPrice = (price: number): string => {
	if (price === 0) return "CENA INDYW.";
	return `${price.toFixed(0)} zł`;
};

// Helper do określania ikony i koloru na podstawie kategorii
function getCategoryTheme(name: string, categoryIndex: number) {
	const themes = {
		podstawowe: {
			icon: Stethoscope,
			iconColor: "bg-blue-500",
			badge: "PODSTAWOWE",
		},
		specjalistyczne: {
			icon: Sparkles,
			iconColor: "bg-green-500",
			badge: "SPECJALISTYCZNE",
		},
		korekcja: {
			icon: Shield,
			iconColor: "bg-purple-500",
			badge: "KOREKCJA",
		},
		dodatkowe: {
			icon: Zap,
			iconColor: "bg-orange-500",
			badge: "DODATKOWE",
		},
	};

	// Normalize category name to match theme keys
	const normalizedName = name
		.toLowerCase()
		.replace(/\s+/g, "")
		.replace(/zabiegi/g, "")
		.replace(/usługi/g, "")
		.replace(/iortopedia/g, "");

	// Find matching theme or fallback to index-based selection
	if (normalizedName.includes("podstawowe")) return themes.podstawowe;
	if (normalizedName.includes("specjalistyczne"))
		return themes.specjalistyczne;
	if (normalizedName.includes("korekcja")) return themes.korekcja;
	if (normalizedName.includes("dodatkowe")) return themes.dodatkowe;

	// Fallback based on categoryIndex
	const fallbackThemes = Object.values(themes);
	return fallbackThemes[categoryIndex % fallbackThemes.length];
}

export function PricingSection({
	servicesByCategory,
	isLoading,
}: PricingSectionProps) {
	if (isLoading) {
		return (
			<div className="py-12 text-center">
				<p className="text-gray-500">Ładowanie cennika...</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{servicesByCategory.map(
				({ category, services: categoryServices }, index) => {
					const theme = getCategoryTheme(category.name, index);
					const Icon = theme.icon;

					return (
						<Card
							key={category.id}
							className="flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-4"
							style={{
								animationDelay: `${index * 100}ms`,
								animationFillMode: "backwards",
							}}
						>
							<CardHeader className="space-y-3">
								<div className="flex items-start justify-between">
									<div
										className={`${theme.iconColor} text-white p-3 rounded-xl transition-transform duration-300`}
									>
										<Icon className="w-6 h-6" />
									</div>
								</div>
								<div>
									<CardTitle className="text-xl mb-1">
										{category.name}
									</CardTitle>
									<CardDescription className="text-sm line-clamp-2">
										{category.description ||
											"Profesjonalne usługi podologiczne"}
									</CardDescription>
								</div>
							</CardHeader>
							<CardContent className="flex-1">
								{categoryServices.length > 0 ? (
									<ul className="space-y-3">
										{categoryServices.map((service) => {
											return (
												<li
													key={service.id}
													className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition-all duration-200 ease-out cursor-pointer group"
												>
													<span className="text-sm font-medium text-foreground flex-1 pr-2">
														{service.name}
													</span>
													<div className="bg-blue-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap group-hover:bg-blue-600 group-hover:scale-105 transition-all duration-200">
														{formatPrice(
															service.price
														)}
													</div>
												</li>
											);
										})}
									</ul>
								) : (
									<div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/60 p-6 text-center text-sm font-medium text-blue-700">
										Oferta w przygotowaniu. Skontaktuj się z
										nami, aby poznać szczegóły.
									</div>
								)}
							</CardContent>
						</Card>
					);
				}
			)}
		</div>
	);
}
