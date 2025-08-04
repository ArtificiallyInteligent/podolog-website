import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Star, 
  Calendar, 
  Heart, 
  Shield, 
  Award,
  Menu,
  X,
  CheckCircle,
  Users,
  Sparkles
} from 'lucide-react'
import './App.css'

// Import obrazów
import gabinetImage1 from './assets/images/gabinet_1.jpg'
import gabinetImage2 from './assets/images/gabinet_2.jpeg'
import gabinetImage3 from './assets/images/gabinet_3.jpeg'
import pielegnacjaImage1 from './assets/images/pielegnacja_stop_1.jpg'
import pielegnacjaImage2 from './assets/images/pielegnacja_stop_2.jpg'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    message: ''
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
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
        const result = await response.json()
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

  const services = [
    {
      title: 'Pedicure podologiczny',
      description: 'Profesjonalna pielęgnacja stóp z usuwaniem modzeli i nagniotków',
      price: 'od 80 zł',
      icon: <Sparkles className="w-6 h-6 text-white" />
    },
    {
      title: 'Leczenie wrastających paznokci',
      description: 'Bezbolesne leczenie wrastających paznokci metodą klamrową',
      price: 'od 120 zł',
      icon: <Heart className="w-6 h-6 text-white" />
    },
    {
      title: 'Usuwanie brodawek',
      description: 'Skuteczne usuwanie brodawek wirusowych metodami podologicznymi',
      price: 'od 100 zł',
      icon: <Shield className="w-6 h-6 text-white" />
    },
    {
      title: 'Orteza na paznokcie',
      description: 'Korekcja kształtu paznokci za pomocą specjalnych ortez',
      price: 'od 150 zł',
      icon: <Award className="w-6 h-6 text-white" />
    }
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
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'sticky-header' : 'bg-white'}`}>
        <div className="container-custom">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">PodoMed</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-primary transition-colors">Strona główna</a>
              <a href="#services" className="text-gray-700 hover:text-primary transition-colors">Usługi</a>
              <a href="#about" className="text-gray-700 hover:text-primary transition-colors">O nas</a>
              <a href="#contact" className="text-gray-700 hover:text-primary transition-colors">Kontakt</a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Button className="btn-primary">
                <Calendar className="w-4 h-4 mr-2" />
                Umów wizytę
              </Button>
            </div>

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
            <nav className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <a href="#home" className="text-gray-700 hover:text-primary transition-colors">Strona główna</a>
                <a href="#services" className="text-gray-700 hover:text-primary transition-colors">Usługi</a>
                <a href="#about" className="text-gray-700 hover:text-primary transition-colors">O nas</a>
                <a href="#contact" className="text-gray-700 hover:text-primary transition-colors">Kontakt</a>
                <Button className="btn-primary w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Umów wizytę
                </Button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero-gradient text-white section-padding pt-24">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Profesjonalna pielęgnacja stóp
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Zadbaj o zdrowie swoich stóp w naszym nowoczesnym gabinecie podologicznym. 
                Oferujemy kompleksową opiekę i najnowsze metody leczenia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  <Calendar className="w-5 h-5 mr-2" />
                  Umów wizytę online
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  <Phone className="w-5 h-5 mr-2" />
                  Zadzwoń teraz
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={gabinetImage1} 
                alt="Gabinet podologiczny" 
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="card-hover border-0 shadow-lg">
                <CardHeader className="text-center">
                  <div className="service-icon">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <Badge variant="secondary" className="text-primary font-semibold">
                    {service.price}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{service.description}</p>
                </CardContent>
              </Card>
            ))}
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
                src={gabinetImage2} 
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

          <div className="grid md:grid-cols-2 gap-12">
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
                    <div className="text-gray-600">+48 123 456 789</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-gray-600">kontakt@podomed.pl</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Adres</div>
                    <div className="text-gray-600">ul. Zdrowia 123<br />00-001 Warszawa</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Godziny otwarcia</div>
                    <div className="text-gray-600">
                      Pon-Pt: 9:00-18:00<br />
                      Sob: 9:00-14:00
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
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
                      <option value="pedicure">Pedicure podologiczny</option>
                      <option value="paznokcie">Leczenie wrastających paznokci</option>
                      <option value="brodawki">Usuwanie brodawek</option>
                      <option value="orteza">Orteza na paznokcie</option>
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
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">PodoMed</span>
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
                <li>+48 123 456 789</li>
                <li>kontakt@podomed.pl</li>
                <li>ul. Zdrowia 123</li>
                <li>00-001 Warszawa</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Godziny otwarcia</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Poniedziałek - Piątek: 9:00-18:00</li>
                <li>Sobota: 9:00-14:00</li>
                <li>Niedziela: Zamknięte</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PodoMed. Wszystkie prawa zastrzeżone.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

