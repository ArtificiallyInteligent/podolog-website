import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";

interface ServiceCategory {
	id: number;
	name: string;
	description?: string | null;
}

interface Service {
	id: number;
	name: string;
	description: string | null;
	price: number;
	duration_minutes: number;
	is_active: boolean;
	category_id: number;
	category?: ServiceCategory | null;
}
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { NavigationLink } from "../components/NavigationLink";
import { ScrollToTopButton } from "../components/ScrollToTopButton";
import { FeatureCarousel } from "../components/AnimatedFeature";
import { PricingSection } from "../components/PricingSection";
import {
	Phone,
	Mail,
	MapPin,
	Clock,
	Star,
	Calendar,
	Menu,
	X,
	CheckCircle,
	Sparkles,
	Stethoscope,
} from "lucide-react";

function LandingPage() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		service: "",
		date: "",
		message: "",
	});
	const [categories, setCategories] = useState<ServiceCategory[]>([]);
	const [services, setServices] = useState<Service[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [categoriesRes, servicesRes] = await Promise.all([
					fetch("/api/service-categories"),
					fetch("/api/services"),
				]);

				if (categoriesRes.ok && servicesRes.ok) {
					const categoriesData: ServiceCategory[] =
						await categoriesRes.json();
					const servicesData: Service[] = await servicesRes.json();
					setCategories(categoriesData);
					setServices(servicesData.filter((s) => s.is_active));
				}
			} catch (error) {
				console.error("Błąd podczas pobierania danych:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	// Helper do formatowania ceny
	const formatPrice = (price: number) => {
		if (price === 0) return "cena indyw.";
		return `${price.toFixed(0)} zł`;
	};

	// Grupuj usługi po kategoriach
	const servicesByCategory = categories.map((category) => ({
		category,
		services: services.filter((s) => s.category_id === category.id),
	}));

	const gabinetMainImage = "/image.webp";
	const pielegnacjaImage1 =
		"https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop";

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch("/api/appointments", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				await response.json();
				alert(
					"Dziękujemy za zgłoszenie! Skontaktujemy się z Państwem w ciągu 24 godzin."
				);
				setFormData({
					name: "",
					email: "",
					phone: "",
					service: "",
					date: "",
					message: "",
				});
			} else {
				const error = await response.json();
				alert(
					`Błąd: ${
						error.error ||
						"Wystąpił problem podczas wysyłania formularza"
					}`
				);
			}
		} catch (error) {
			console.error("Błąd:", error);
			alert(
				"Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie."
			);
		}
	};

	const testimonials = [
		{
			name: "Anna Kowalska",
			rating: 5,
			text: "Profesjonalna obsługa i świetne efekty. Polecam każdemu, kto ma problemy ze stopami.",
		},
		{
			name: "Marek Nowak",
			rating: 5,
			text: "Wreszcie znalazłem gabinet, gdzie czuję się komfortowo. Bardzo dziękuję za pomoc.",
		},
		{
			name: "Katarzyna Wiśniewska",
			rating: 5,
			text: "Bezbolesne zabiegi i widoczne efekty już po pierwszej wizycie. Gorąco polecam!",
		},
	];

	return (
		<div className="min-h-screen bg-white">
			<header className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-sm">
				<div className="container-custom">
					<div className="flex items-center justify-between py-4">
						<div className="flex items-center space-x-2">
							<div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
								<Stethoscope className="w-6 h-6 text-white" />
							</div>
							<span className="text-xl font-bold text-blue-600 hidden md:block">
								podolog M. Rygalska
							</span>
							<span className="text-xl font-bold text-blue-600 md:hidden">
								podolog M. Rygalska
							</span>
						</div>

						<nav className="hidden md:flex items-center space-x-8">
							<NavigationLink
								href="#home"
								className="text-blue-600 hover:text-black transition-colors"
							>
								Strona główna
							</NavigationLink>
							<NavigationLink
								href="#services"
								className="text-blue-600 hover:text-black transition-colors"
							>
								Usługi
							</NavigationLink>
							<NavigationLink
								href="#pricing"
								className="text-blue-600 hover:text-black transition-colors"
							>
								Cennik
							</NavigationLink>
							<NavigationLink
								href="#about"
								className="text-blue-600 hover:text-black transition-colors"
							>
								O nas
							</NavigationLink>
							<NavigationLink
								href="#contact"
								className="text-blue-600 hover:text-black transition-colors"
							>
								Kontakt
							</NavigationLink>
							<NavigationLink href="#contact">
								<Button className="btn-primary">
									<Calendar className="w-4 h-4 mr-2" />
									Umów wizytę
								</Button>
							</NavigationLink>
						</nav>

						<button
							className="md:hidden"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						>
							{isMenuOpen ? (
								<X className="w-6 h-6" />
							) : (
								<Menu className="w-6 h-6" />
							)}
						</button>
					</div>

					{isMenuOpen && (
						<nav className="md:hidden py-4 border-t border-gray-200">
							<div className="flex flex-col space-y-4">
								<NavigationLink
									href="#home"
									className="text-blue-600 hover:text-white transition-colors"
									onClick={() => setIsMenuOpen(false)}
								>
									Strona główna
								</NavigationLink>
								<NavigationLink
									href="#services"
									className="text-blue-600 hover:text-black transition-colors"
									onClick={() => setIsMenuOpen(false)}
								>
									Usługi
								</NavigationLink>
								<NavigationLink
									href="#about"
									className="text-blue-600 hover:text-black transition-colors"
									onClick={() => setIsMenuOpen(false)}
								>
									O nas
								</NavigationLink>
								<NavigationLink
									href="#contact"
									className="text-blue-600 hover:text-black transition-colors"
									onClick={() => setIsMenuOpen(false)}
								>
									Kontakt
								</NavigationLink>
								<NavigationLink
									href="#contact"
									onClick={() => setIsMenuOpen(false)}
								>
									<Button
										className="btn-primary w-full"
										size="lg"
									>
										<Calendar className="w-4 h-4 mr-2" />
										Umów wizytę
									</Button>
								</NavigationLink>
							</div>
						</nav>
					)}
				</div>
			</header>

			<section
				id="home"
				className="relative text-white section-padding pt-24 min-h-screen flex items-center"
				style={{
					backgroundImage: "url(/hero.png)",
					backgroundSize: "cover",
					backgroundPosition: "center",
					transform: "scaleX(-1)",
				}}
			>
				<div className="absolute inset-0 bg-black/40"></div>

				<div
					className="container-custom relative z-10"
					style={{ transform: "scaleX(-1)" }}
				>
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div className="animate-fade-in">
							<h1 className="text-4xl md:text-6xl font-bold mb-8 font-serif">
								Zadbajmy o Twoje stopy
							</h1>
							<div className="flex flex-col sm:flex-row gap-4">
								<NavigationLink href="#contact">
									<Button size="lg" className="btn-primary">
										<Calendar className="w-5 h-5 mr-2" />
										Umów wizytę online
									</Button>
								</NavigationLink>
								<a
									href="tel:513033294"
									className="inline-block"
								>
									<Button size="lg" className="btn-white">
										<Phone className="w-5 h-5 mr-2" />
										Zadzwoń teraz
									</Button>
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="py-16 bg-gray-50">
				<div className="container-custom">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
						<div>
							<div className="text-3xl font-bold text-primary mb-2">
								500+
							</div>
							<div className="text-gray-600">
								Zadowolonych pacjentów
							</div>
						</div>
						<div>
							<div className="text-3xl font-bold text-primary mb-2">
								5
							</div>
							<div className="text-gray-600">
								lat doświadczenia
							</div>
						</div>
						<div>
							<div className="text-3xl font-bold text-primary mb-2">
								98%
							</div>
							<div className="text-gray-600">
								Pozytywnych opinii
							</div>
						</div>
						<div>
							<div className="text-3xl font-bold text-primary mb-2">
								24h
							</div>
							<div className="text-gray-600">
								Odpowiedź na zgłoszenia
							</div>
						</div>
					</div>
				</div>
			</section>

			<section id="services" className="pt-20 pb-0">
				<div className="container-custom">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							Nasze usługi
						</h2>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							Oferujemy szeroki zakres usług podologicznych
							dostosowanych do indywidualnych potrzeb każdego
							pacjenta
						</p>
					</div>

					{isLoading ? (
						<div className="py-12 text-center">
							<p className="text-gray-500">Ładowanie usług...</p>
						</div>
					) : (
						<div className="flex justify-center">
							<FeatureCarousel
								categories={categories.map((cat) => ({
									id: cat.id.toString(), // ID jako string
									name: cat.name,
								}))}
								allServices={categories.reduce(
									(acc, category) => {
										// Użyj category.id.toString() jako klucz
										const categoryServices = services
											.filter(
												(s) =>
													s.category_id ===
													category.id
											)
											.map((service) => ({
												id: service.id.toString(),
												name: service.name,
												title: service.name,
												description:
													service.description ||
													"Brak opisu usługi.",
												duration_minutes:
													service.duration_minutes,
												icon:
													service.duration_minutes > 0
														? Clock
														: Sparkles,
											}));

										acc[category.id.toString()] =
											categoryServices;
										return acc;
									},
									{} as Record<
										string,
										Array<{
											id: string;
											name: string;
											title: string;
											description: string;
											duration_minutes?: number;
											icon: any;
										}>
									>
								)}
							/>
						</div>
					)}
				</div>
			</section>

			<section
				id="pricing"
				className="relative overflow-hidden section-padding"
			>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-blue-50/90 via-white/60 to-transparent"
				/>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute left-1/2 top-10 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-200/50 blur-[120px]"
				/>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_55%)]"
				/>
				<div className="container-custom relative">
					<div className="mb-12 flex flex-col items-center gap-6 text-center md:mb-16">
						<h2 className="max-w-3xl text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
							Cennik usług
						</h2>
						<p className="max-w-3xl text-base text-gray-600/90 md:text-lg">
							Transparentne pakiety zabiegów zaprojektowane tak,
							aby precyzyjnie odpowiadać na potrzeby Twoich stóp –
							od profilaktyki, przez specjalistyczne terapie, aż
							po indywidualne rozwiązania ortopedyczne.
						</p>
					</div>

					<PricingSection
						servicesByCategory={servicesByCategory}
						isLoading={isLoading}
					/>
				</div>
			</section>

			<section id="about" className="section-padding bg-white">
				<div className="container-custom">
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div>
							<h2 className="text-3xl md:text-4xl font-bold mb-6">
								O naszym gabinecie
							</h2>
							<p className="text-lg text-gray-600 mb-6">
								Nasz gabinet podologiczny to miejsce, gdzie
								łączymy najnowsze technologie z indywidualnym
								podejściem do każdego pacjenta. Specjalizujemy
								się w kompleksowej pielęgnacji stóp oraz
								leczeniu różnorodnych dolegliwości.
							</p>

							<div className="space-y-4">
								<div className="flex items-center space-x-3">
									<CheckCircle className="w-5 h-5 text-primary" />
									<span>
										Certyfikowany podolog z 5-letnim
										doświadczeniem
									</span>
								</div>
								<div className="flex items-center space-x-3">
									<CheckCircle className="w-5 h-5 text-primary" />
									<span>
										Nowoczesny sprzęt i sterylne warunki
									</span>
								</div>
								<div className="flex items-center space-x-3">
									<CheckCircle className="w-5 h-5 text-primary" />
									<span>
										Indywidualne podejście do każdego
										pacjenta
									</span>
								</div>
								<div className="flex items-center space-x-3">
									<CheckCircle className="w-5 h-5 text-primary" />
									<span>
										Bezbolesne i skuteczne metody leczenia
									</span>
								</div>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<img
								src={gabinetMainImage}
								alt="Gabinet podologiczny wnętrze"
								className="rounded-lg shadow-lg"
							/>
							<img
								src={pielegnacjaImage1}
								alt="Pielęgnacja stóp"
								className="rounded-lg shadow-lg mt-8"
							/>
						</div>
					</div>
				</div>
			</section>

			<section className="section-padding">
				<div className="container-custom">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							Opinie naszych pacjentów
						</h2>
						<p className="text-xl text-gray-600">
							Zobacz, co mówią o nas zadowoleni klienci
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						{testimonials.map((testimonial, index) => (
							<Card key={index} className="testimonial-card">
								<CardContent className="pt-6">
									<div className="flex mb-4">
										{[...Array(testimonial.rating)].map(
											(_, i) => (
												<Star
													key={i}
													className="w-5 h-5 text-yellow-400 fill-current"
												/>
											)
										)}
									</div>
									<p className="text-gray-600 mb-4 italic">
										"{testimonial.text}"
									</p>
									<div className="font-semibold text-primary">
										{testimonial.name}
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			<section id="contact" className="section-padding bg-gray-50">
				<div className="container-custom">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							Skontaktuj się z nami
						</h2>
						<p className="text-xl text-gray-600">
							Umów wizytę lub zadaj pytanie
						</p>
					</div>

					<div className="grid lg:grid-cols-3 gap-12">
						<div>
							<h3 className="text-2xl font-bold mb-6">
								Informacje kontaktowe
							</h3>
							<div className="space-y-6">
								<div className="flex items-center space-x-4">
									<div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
										<Phone className="w-6 h-6 text-white" />
									</div>
									<div>
										<div className="font-semibold">
											Telefon
										</div>
										<div className="text-gray-600">
											513 033 294
										</div>
									</div>
								</div>

								<div className="flex items-center space-x-4">
									<div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
										<Mail className="w-6 h-6 text-white" />
									</div>
									<div>
										<div className="font-semibold">
											Email
										</div>
										<div className="text-gray-600">
											kontakt@podolog-michalina.pl
										</div>
									</div>
								</div>

								<div className="flex items-center space-x-4">
									<div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
										<MapPin className="w-6 h-6 text-white" />
									</div>
									<div>
										<div className="font-semibold">
											Adres
										</div>
										<div className="text-gray-600">
											Modrzejowska 29
											<br />
											41-200 Sosnowiec
										</div>
									</div>
								</div>

								<div className="flex items-center space-x-4">
									<div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
										<Clock className="w-6 h-6 text-white" />
									</div>
									<div>
										<div className="font-semibold">
											Godziny otwarcia
										</div>
										<div className="text-gray-600">
											Pon-Pt: 08:00-20:00
											<br />
											Sob: Zamknięte
											<br />
											Ndz: Zamknięte
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="lg:col-span-2">
							<h3 className="text-2xl font-bold mb-6">
								Formularz kontaktowy
							</h3>

							<form
								onSubmit={handleSubmit}
								className="contact-form space-y-6"
							>
								<div className="grid md:grid-cols-2 gap-4">
									<div>
										<Input
											type="text"
											name="name"
											placeholder="Imię i nazwisko"
											value={formData.name}
											onChange={handleInputChange}
											required
										/>
									</div>
									<div>
										<Input
											type="email"
											name="email"
											placeholder="Email"
											value={formData.email}
											onChange={handleInputChange}
											required
										/>
									</div>
								</div>

								<div className="grid md:grid-cols-2 gap-4">
									<div>
										<Input
											type="tel"
											name="phone"
											placeholder="Telefon"
											value={formData.phone}
											onChange={handleInputChange}
										/>
									</div>
									<div>
										<select
											name="service"
											value={formData.service}
											onChange={handleInputChange}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
											required
										>
											<option value="">
												Wybierz usługę
											</option>
											{!isLoading &&
												servicesByCategory.map(
													({
														category,
														services: catServices,
													}) => (
														<optgroup
															key={category.id}
															label={
																category.name
															}
														>
															{catServices.map(
																(service) => (
																	<option
																		key={
																			service.id
																		}
																		value={
																			service.name
																		}
																	>
																		{
																			service.name
																		}
																		{service.price >
																		0
																			? ` - ${formatPrice(
																					service.price
																			  )}`
																			: " - Cena indyw."}
																	</option>
																)
															)}
														</optgroup>
													)
												)}
										</select>
									</div>
								</div>

								<div>
									<Input
										type="date"
										name="date"
										value={formData.date}
										onChange={handleInputChange}
									/>
								</div>

								<div>
									<Textarea
										name="message"
										placeholder="Dodatkowe informacje..."
										rows={4}
										value={formData.message}
										onChange={handleInputChange}
									/>
								</div>

								<Button
									type="submit"
									className="btn-primary w-full"
									size="lg"
								>
									Wyślij zgłoszenie
								</Button>
							</form>
						</div>
					</div>

					<div className="mt-16">
						<h3 className="text-3xl font-bold mb-8 text-center">
							Lokalizacja gabinetu
						</h3>
						<div className="google-map-container w-full max-w-5xl mx-auto">
							<div className="w-full h-96 md:h-[400px] lg:h-[450px] rounded-lg overflow-hidden relative">
								<iframe
									src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2548.6513985826547!2d19.09788037650984!3d50.29147511109058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4716f019e6e9a5f5%3A0x7c7e1b7c8f8e9f0!2sModrzejowska%2029%2C%2041-200%20Sosnowiec!5e0!3m2!1spl!2spl!4v1691234567890"
									width="100%"
									height="100%"
									style={{ border: 0 }}
									allowFullScreen={true}
									loading="lazy"
									referrerPolicy="no-referrer-when-downgrade"
									title="Lokalizacja gabinetu podologicznego"
									className="google-map-iframe"
								></iframe>

								<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
									<a
										href="https://www.google.com/maps/place/Modrzejowska+29,+41-200+Sosnowiec"
										target="_blank"
										rel="noopener noreferrer"
										className="map-button text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all duration-300 flex items-center space-x-2"
									>
										<MapPin className="w-4 h-4" />
										<span>Otwórz w Google Maps</span>
									</a>
								</div>
							</div>

							<div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
									<div className="flex items-center space-x-2">
										<div className="w-2 h-2 bg-green-500 rounded-full" />
										<span className="text-gray-700">
											Łatwy dojazd komunikacją publiczną
										</span>
									</div>
									<div className="flex items-center space-x-2">
										<div className="w-2 h-2 bg-blue-500 rounded-full" />
										<span className="text-gray-700">
											Parking dostępny w okolicy
										</span>
									</div>
									<div className="flex items-center space-x-2">
										<div className="w-2 h-2 bg-purple-500 rounded-full" />
										<span className="text-gray-700">
											10 min pieszo od dworca
										</span>
									</div>
									<div className="flex items-center space-x-2">
										<div className="w-2 h-2 bg-orange-500 rounded-full" />
										<span className="text-gray-700">
											Dostęp dla osób niepełnosprawnych
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<footer className="bg-gray-900 text-white py-12">
				<div className="container-custom">
					<div className="grid md:grid-cols-4 gap-8">
						<div>
							<div className="flex items-center space-x-2 mb-4">
								<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
									<Stethoscope className="w-5 h-5 text-white" />
								</div>
								<span className="text-xl font-bold">
									podolog M. Rygalska
								</span>
							</div>
							<p className="text-gray-400">
								Profesjonalny gabinet podologiczny oferujący
								kompleksową opiekę nad zdrowiem stóp.
							</p>
						</div>

						<div>
							<h4 className="font-semibold mb-4">Usługi</h4>
							<ul className="space-y-2 text-gray-400">
								<li>Pedicure podologiczny</li>
								<li>Leczenie wrastających paznokci</li>
								<li>Usuwanie brodawek</li>
								<li>Orteza na paznokcie</li>
							</ul>
						</div>

						<div>
							<h4 className="font-semibold mb-4">Kontakt</h4>
							<ul className="space-y-2 text-gray-400">
								<li>513 033 294</li>
								<li>kontakt@podolog-michalina.pl</li>
								<li>Modrzejowska 29</li>
								<li>41-200 Sosnowiec</li>
							</ul>
						</div>

						<div>
							<h4 className="font-semibold mb-4">
								Godziny otwarcia
							</h4>
							<ul className="space-y-2 text-gray-400">
								<li>Poniedziałek - Piątek: 08:00-20:00</li>
								<li>Sobota: Zamknięte</li>
								<li>Niedziela: Zamknięte</li>
							</ul>
						</div>
					</div>

					<div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
						<p>
							&copy; 2024 Gabinet Podologiczny Michalina Rygalska.
							Wszystkie prawa zastrzeżone.
						</p>
					</div>
				</div>
			</footer>

			<ScrollToTopButton />
		</div>
	);
}

export default LandingPage;
