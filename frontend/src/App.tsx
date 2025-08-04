import React, { useState } from 'react'
import { Button } from './components/ui/button'
import { Card, CardContent } from './components/ui/card'
import { Input } from './components/ui/input'
import { Textarea } from './components/ui/textarea'
import { NavigationLink } from './components/NavigationLink'
import { ScrollToTopButton } from './components/ScrollToTopButton'
import { FeatureCarousel } from './components/AnimatedFeature'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Star, 
  Calendar, 
  Shield, 
  Award,
  Menu,
  X,
  CheckCircle,
  Sparkles,
  Stethoscope
} from 'lucide-react'
import './App.css'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    message: ''
  })

  // Images
  const gabinetMainImage = "/image.webp" // Główne zdjęcie gabinetu
  const pielegnacjaImage1 = "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop"

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        await response.json()
        alert('Dziękujemy za zgłoszenie! Skontaktujemy się z Państwem w ciągu 24 godzin.')
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          date: '',
          message: ''
        })
      } else {
        const error = await response.json()
        alert(`Błąd: ${error.error || 'Wystąpił problem podczas wysyłania formularza'}`)
      }
    } catch (error) {
      console.error('Błąd:', error)
      alert('Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.')
    }
  }

  const services = {
    podstawowe: [
      {
        id: 'konsultacja-podologiczna',
        name: 'Konsultacja podologiczna',
        title: 'Konsultacja podologiczna',
        description: 'Profesjonalna ocena stanu zdrowia stóp i doradztwo',
        icon: <Stethoscope className="w-6 h-6 text-white" />
      },
      {
        id: 'podstawowy-zabieg',
        name: 'Podstawowy zabieg podologiczny',
        title: 'Podstawowy zabieg podologiczny',
        description: 'Kompleksowa pielęgnacja stóp z profesjonalnym podejściem',
        icon: <Sparkles className="w-6 h-6 text-white" />
      },
      {
        id: 'obciecie-paznokci',
        name: 'Obcięcie paznokci',
        title: 'Obcięcie paznokci',
        description: 'Prawidłowe obcięcie paznokci u stóp metodą podologiczną',
        icon: <Shield className="w-6 h-6 text-white" />
      },
      {
        id: 'pekajace-piety',
        name: 'Pękające pięty',
        title: 'Pękające pięty',
        description: 'Leczenie i pielęgnacja pękających pięt',
        icon: <Award className="w-6 h-6 text-white" />
      }
    ],
    specjalistyczne: [
      {
        id: 'usuwanie-odciskow',
        name: 'Usuwanie odcisków i modzeli',
        title: 'Usuwanie odcisków i modzeli',
        description: 'Bezbolesne usuwanie odcisków i modzeli z zastosowaniem profesjonalnych narzędzi',
        icon: <Shield className="w-6 h-6 text-white" />
      },
      {
        id: 'leczenie-brodawek',
        name: 'Leczenie brodawek',
        title: 'Leczenie brodawek',
        description: 'Skuteczne leczenie brodawek wirusowych metodami podologicznymi',
        icon: <Sparkles className="w-6 h-6 text-white" />
      },
      {
        id: 'rekonstrukcja-paznokci',
        name: 'Rekonstrukcja paznokci',
        title: 'Rekonstrukcja paznokci',
        description: 'Odbudowa uszkodzonych lub brakujących paznokci',
        icon: <Award className="w-6 h-6 text-white" />
      },
      {
        id: 'badanie-mykologiczne',
        name: 'Badanie mykologiczne',
        title: 'Badanie mykologiczne',
        description: 'Diagnostyka grzybicy paznokci i stóp',
        icon: <Stethoscope className="w-6 h-6 text-white" />
      }
    ],
    korekcja: [
      {
        id: 'leczenie-wrastajacych',
        name: 'Leczenie wrastających paznokci',
        title: 'Leczenie wrastających paznokci',
        description: 'Bezbolesne leczenie wrastających paznokci metodą klamrową',
        icon: <Shield className="w-6 h-6 text-white" />
      },
      {
        id: 'tamponada',
        name: 'Tamponada',
        title: 'Tamponada',
        description: 'Metoda leczenia wrastających paznokci z użyciem tamponady',
        icon: <Sparkles className="w-6 h-6 text-white" />
      },
      {
        id: 'orteza',
        name: 'Orteza',
        title: 'Orteza',
        description: 'Korekcja kształtu paznokci za pomocą specjalnych ortez',
        icon: <Award className="w-6 h-6 text-white" />
      },
      {
        id: 'separator-palcow',
        name: 'Separator palców',
        title: 'Separator palców',
        description: 'Korekcja ustawienia palców stóp',
        icon: <Stethoscope className="w-6 h-6 text-white" />
      }
    ],
    dodatkowe: [
      {
        id: 'taping',
        name: 'Taping (kinesiotaping)',
        title: 'Taping (kinesiotaping)',
        description: 'Terapeutyczne oklejanie stóp taśmami kinesio',
        icon: <Award className="w-6 h-6 text-white" />
      },
      {
        id: 'wizyty-domowe',
        name: 'Wizyty domowe',
        title: 'Wizyty domowe',
        description: 'Profesjonalna opieka podologiczna w zaciszu własnego domu',
        icon: <Stethoscope className="w-6 h-6 text-white" />
      },
      {
        id: 'leczenie-onycholizy',
        name: 'Leczenie onycholizy',
        title: 'Leczenie onycholizy',
        description: 'Leczenie odwarstwienia płytki paznokciowej',
        icon: <Shield className="w-6 h-6 text-white" />
      },
      {
        id: 'klin-silikonowy',
        name: 'Klin silikonowy',
        title: 'Klin silikonowy',
        description: 'Zastosowanie klinów silikonowych do korekcji',
        icon: <Shield className="w-6 h-6 text-white" />
      }
    ]
  }

  const serviceCategories = [
    { id: 'podstawowe', name: 'PODSTAWOWE ZABIEGI' },
    { id: 'specjalistyczne', name: 'ZABIEGI SPECJALISTYCZNE' },
    { id: 'korekcja', name: 'KOREKCJA I ORTOPEDIA' },
    { id: 'dodatkowe', name: 'USŁUGI DODATKOWE' }
  ]

  const testimonials = [
    {
      name: 'Anna Kowalska',
      rating: 5,
      text: 'Profesjonalna obsługa i świetne efekty. Polecam każdemu, kto ma problemy ze stopami.'
    },
    {
      name: 'Marek Nowak',
      rating: 5,
      text: 'Wreszcie znalazłem gabinet, gdzie czuję się komfortowo. Bardzo dziękuję za pomoc.'
    },
    {
      name: 'Katarzyna Wiśniewska',
      rating: 5,
      text: 'Bezbolesne zabiegi i widoczne efekty już po pierwszej wizycie. Gorąco polecam!'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-blue-600 hidden md:block">podolog M. Rygalska</span>
              <span className="text-xl font-bold text-blue-600 md:hidden">podolog M. Rygalska</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <NavigationLink href="#home" className="text-gray-700 hover:text-blue-600 transition-colors">
                Strona główna
              </NavigationLink>
              <NavigationLink href="#services" className="text-gray-700 hover:text-blue-600 transition-colors">
                Usługi
              </NavigationLink>
              <NavigationLink href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">
                O nas
              </NavigationLink>
              <NavigationLink href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">
                Kontakt
              </NavigationLink>
              <Button className="btn-primary">
                <Calendar className="w-4 h-4 mr-2" />
                Umów wizytę
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <NavigationLink 
                  href="#home" 
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Strona główna
                </NavigationLink>
                <NavigationLink 
                  href="#services" 
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Usługi
                </NavigationLink>
                <NavigationLink 
                  href="#about" 
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  O nas
                </NavigationLink>
                <NavigationLink 
                  href="#contact" 
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kontakt
                </NavigationLink>
                <Button className="btn-primary w-full" size="lg">
                  <Calendar className="w-4 h-4 mr-2" />
                  Umów wizytę
                </Button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section 
        id="home" 
        className="relative text-white section-padding pt-24 min-h-screen flex items-center"
        style={{
          backgroundImage: 'url(/hero.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'scaleX(-1)'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="container-custom relative z-10" style={{ transform: 'scaleX(-1)' }}>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold mb-8 font-serif">
                Zadbajmy o Twoje stopy
              </h1>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="btn-primary">
                  <Calendar className="w-5 h-5 mr-2" />
                  Umów wizytę online
                </Button>
                <Button size="lg" className="btn-white">
                  <Phone className="w-5 h-5 mr-2" />
                  Zadzwoń teraz
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600">Zadowolonych pacjentów</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">5</div>
              <div className="text-gray-600">lat doświadczenia</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <div className="text-gray-600">Pozytywnych opinii</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24h</div>
              <div className="text-gray-600">Odpowiedź na zgłoszenia</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nasze usługi</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Oferujemy szeroki zakres usług podologicznych dostosowanych do indywidualnych potrzeb każdego pacjenta
            </p>
          </div>

          {/* Nowy FeatureCarousel dla kategorii */}
          <div className="flex justify-center">
            <FeatureCarousel
              categories={serviceCategories}
              allServices={services}
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">O naszym gabinecie</h2>
              <p className="text-lg text-gray-600 mb-6">
                Nasz gabinet podologiczny to miejsce, gdzie łączymy najnowsze technologie z indywidualnym podejściem do każdego pacjenta. 
                Specjalizujemy się w kompleksowej pielęgnacji stóp oraz leczeniu różnorodnych dolegliwości.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Certyfikowany podolog z 5-letnim doświadczeniem</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Nowoczesny sprzęt i sterylne warunki</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Indywidualne podejście do każdego pacjenta</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Bezbolesne i skuteczne metody leczenia</span>
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

      {/* Testimonials Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Opinie naszych pacjentów</h2>
            <p className="text-xl text-gray-600">Zobacz, co mówią o nas zadowoleni klienci</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="testimonial-card">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                  <div className="font-semibold text-primary">{testimonial.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Skontaktuj się z nami</h2>
            <p className="text-xl text-gray-600">Umów wizytę lub zadaj pytanie</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Informacje kontaktowe</h3>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Telefon</div>
                    <div className="text-gray-600">513 033 294</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-gray-600">kontakt@podolog-michalina.pl</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Adres</div>
                    <div className="text-gray-600">Modrzejowska 29<br />41-200 Sosnowiec</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Godziny otwarcia</div>
                    <div className="text-gray-600">
                      Pon-Pt: 08:00-20:00<br />
                      Sob: Zamknięte<br />
                      Ndz: Zamknięte
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-6">Formularz kontaktowy</h3>
              
              <form onSubmit={handleSubmit} className="contact-form space-y-6">
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
                    >
                      <option value="">Wybierz usługę</option>
                      <option value="konsultacja">Konsultacja podologiczna</option>
                      <option value="podstawowy">Podstawowy zabieg podologiczny</option>
                      <option value="paznokcie">Leczenie wrastających paznokci</option>
                      <option value="brodawki">Leczenie brodawek</option>
                      <option value="odciski">Usuwanie odcisków i modzeli</option>
                      <option value="orteza">Orteza na paznokcie</option>
                      <option value="wizyty-domowe">Wizyty domowe</option>
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

                <Button type="submit" className="btn-primary w-full" size="lg">
                  Wyślij zgłoszenie
                </Button>
              </form>
            </div>
          </div>

          {/* Google Maps - Full Width */}
          <div className="mt-16">
            <h3 className="text-3xl font-bold mb-8 text-center">Lokalizacja gabinetu</h3>
            <div className="google-map-container w-full max-w-5xl mx-auto">
              {/* Map container with enhanced styling */}
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
                
                {/* Przycisk "Otwórz w Google Maps" - wycentrowany na dole */}
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
              
              {/* Dodatkowe informacje pod mapą */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Łatwy dojazd komunikacją publiczną</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Parking dostępny w okolicy</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700">10 min pieszo od dworca</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700">Dostęp dla osób niepełnosprawnych</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">podolog M. Rygalska</span>
              </div>
              <p className="text-gray-400">
                Profesjonalny gabinet podologiczny oferujący kompleksową opiekę nad zdrowiem stóp.
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
              <h4 className="font-semibold mb-4">Godziny otwarcia</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Poniedziałek - Piątek: 08:00-20:00</li>
                <li>Sobota: Zamknięte</li>
                <li>Niedziela: Zamknięte</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Gabinet Podologiczny Michalina Rygalska. Wszystkie prawa zastrzeżone.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  )
}

export default App

