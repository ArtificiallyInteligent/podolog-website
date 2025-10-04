<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Instrukcje dla GitHub Copilot

## ⚠️ KRYTYCZNE WYMAGANIA - PRZECZYTAJ NAJPIERW!

### 🔍 ZAWSZE przed rozpoczęciem pracy:
1. **SZCZEGÓLNIE WAŻNE: Tailwind CSS v4.x (@tailwindcss/vite) - TYLKO TA WERSJA!**
2. **Sprawdź kompatybilność składni ze wszystkimi używanymi bibliotekami**
3. **NIE mieszaj składni różnych wersji Tailwind CSS**

### 🐍 BACKEND (Python / Flask) – WYMÓG AKTYWACJI VENV
- **ABSOLUTNY WARUNEK**: Przed **KAŻDĄ** komendą `python`, `pip` lub `python3` w terminalu **OBOWIĄZKOWO** dodaj prefix PowerShell, który:
  1. Sprawdza, czy środowisko `.venv` jest aktywne (`$env:VIRTUAL_ENV`).
  2. Jeśli **NIE** jest aktywne – uruchamia je z podanej ścieżki.
  3. Następnie wykonuje właściwą komendę `python`.

- **Format komendy (pwsh)**:
```pwsh
if (-not $env:VIRTUAL_ENV) { & "C:\Users\rogue\podolog-website\.venv\Scripts\Activate.ps1" }; python <twoja_komenda>
```

### 🚨 TAILWIND CSS v4.x - ZASADY BEZWZGLĘDNE:
- **UŻYWAMY TYLKO: @tailwindcss/vite v4.1.11**
- **@import "tailwindcss" zamiast starszych importów**
- **@theme inline { } do definiowania zmiennych CSS**
- **@custom-variant dla wariantów**
- **Sprawdź dokumentację v4.x przed każdą zmianą CSS!**
- **NIE używaj składni z v3.x lub starszych wersji!**

## Opis projektu
To jest zaawansowana aplikacja webowa dla gabinetu podologicznego z nowoczesnymi animacjami i interaktywnymi komponentami:
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4.x + Framer Motion + Lucide Icons + Google Fonts
- **Backend**: Flask + SQLAlchemy + SQLite + Flask-CORS

## Zaktualizowana struktura projektu
```
/
├── frontend/              # Frontend React
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnimatedFeature.tsx    # FeatureCarousel z animacjami
│   │   │   ├── TextMorph.tsx         # Animacje morfowania tekstu
│   │   │   ├── NavigationLink.tsx     # Komponenty nawigacji
│   │   │   ├── ScrollToTopButton.tsx  # Scroll to top
│   │   │   └── ui/                   # Shadcn/ui komponenty
│   │   │       ├── badge.tsx
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── input.tsx
│   │   │       └── textarea.tsx
│   │   ├── App.tsx               # Główna aplikacja z hero section
│   │   ├── App.css              # Tailwind v4.x + custom styles
│   │   └── main.tsx
│   ├── public/
│   │   ├── hero.png             # Główne zdjęcie hero
│   │   └── dziekuje.jpeg        # Backup zdjęcie
│   └── index.html               # Google Fonts (Righteous, Fredoka)
├── backend/                     # Backend Flask
└── .github/
    └── copilot-instructions.md  # Ten plik
```

## Zaawansowane funkcjonalności zaimplementowane

### 🎪 AnimatedFeature.tsx - FeatureCarousel
- **2x2 grid siatka usług** z Framer Motion
- **Kategorie usług**: podstawowe, specjalistyczne, korekcja, dodatkowe
- **Animacje kierunkowe**: lewe karty z lewej, prawe z prawej (x: -50/50)
- **Sekwencyjne pojawianie**: 0.15s delay między kartami
- **Navigation z motion.span** animacjami dla kategorii
- **Responsywne breakpointy**: mobile, tablet, desktop

### 🎭 Hero Section z warstwowym tekstem
- **Tło obrazkowe**: hero.png z transform: scaleX(-1)
- **Duży tekst tła**: "Stopy" w font-righteous, text-white/15
- **Główny tekst**: "Zadbajmy o Twoje stopy" w font-serif
- **Pozycjonowanie absolutne** z z-index layering
- **Responsive rozmiary**: text-3xl → text-7xl
- **Overlay bg-black/40** dla kontrastu

### 🎨 Google Fonts Integration
- **Righteous**: Zaokrąglony, nowoczesny font dla efektów
- **Fredoka**: Alternatywny font weights 300-700
- **font-serif**: Tailwind built-in dla eleganckich tytułów

### 📱 Responsywne breakpointy
- **Mobile**: text-3xl, min-h-[400px], -top-8
- **Tablet**: md:text-5xl, md:min-h-[500px], md:-top-12  
- **Desktop**: lg:text-6xl, xl:text-7xl, xl:text-[12rem]

## Zasady kodowania

### Frontend (React + TypeScript)
- **React 19** z nowymi hookami i funkcjami
- **TypeScript strict mode** dla wszystkich komponentów
- **Tailwind CSS v4.x TYLKO** - @tailwindcss/vite
- **Framer Motion v12.x** dla wszystkich animacji
- **Lucide Icons** konsystentnie w całym projekcie
- **Google Fonts** przez index.html
- **Responsive-first design** z mobile breakpoints

### 🎬 Framer Motion - Standardy animacji
```tsx
// Warianty animacji
const variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

// Kierunkowe animacje
const isLeftSide = index % 2 === 0
initial={{ opacity: 0, x: isLeftSide ? -50 : 50 }}
animate={{ opacity: 1, x: 0 }}
transition={{ duration: 0.8, delay: index * 0.15 }}
```

### 🎨 Tailwind CSS v4.x - Nowa składnia
```css
/* v4.x ONLY syntax */
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-primary: var(--primary);
  /* Custom properties */
}

/* Custom classes */
.font-righteous {
  font-family: 'Righteous', sans-serif;
}
```

### Backend (Flask + Python)
- Flask-SQLAlchemy z SQLite database
- API endpoints z prefiksem `/api/`
- Flask-CORS dla frontend komunikacji
- JSON responses z proper HTTP codes

## Nowe komponenty i ich zastosowania

### FeatureCarousel
```tsx
<FeatureCarousel 
  categories={categories}
  allServices={allServices}
/>
```
- **Kategorie**: Array of {name, id}
- **Services**: Object with category keys
- **Auto-animation**: Sequential card appearance
- **Grid layout**: 2x2 responsive grid

### TextMorph (available but not used)
```tsx
<TextMorph 
  texts={["Text 1", "Text 2"]} 
  morphTime={1}
  cooldownTime={0.25}
  className="custom-class"
  textClassName="text-styles"
/>
```

## Konwencje nazewnictwa
- **Komponenty React**: PascalCase (AnimatedFeature.tsx)
- **Pliki CSS**: kebab-case (app.css)
- **API endpointy**: snake_case (/api/get_patients)
- **CSS klasy**: Tailwind utilities + custom classes
- **Animation variants**: camelCase (fadeInUp, slideLeft)

## Style Guidelines

### 🎨 Color Palette
- **Primary**: Blue gradient (blue-600 → blue-500)
- **Text**: white z drop-shadow-lg na ciemnych tłach
- **Overlay**: bg-black/40 dla lepszego kontrastu
- **Transparency**: /15, /60, /70 dla różnych poziomów

### 📏 Spacing & Sizing
- **Container**: container-custom (defined in CSS)
- **Sections**: section-padding (defined in CSS)
- **Min heights**: min-h-[400px] mobile, min-h-[500px] desktop
- **Gaps**: gap-4, gap-6, gap-12 dla różnych kontekstów

## Porty i URLs (ZAKTUALIZOWANE)
- **Frontend**: http://localhost:5174 (Vite dev server)
- **Backend**: http://localhost:5000 (Flask)
- **API endpoints**: http://localhost:5000/api/*

## Baza danych
- **SQLite**: backend/database/app.db
- **Modele**: User, Appointment (w src/models/)
- **Routes**: user.py, appointment.py (w src/routes/)

## 🚫 ZABRONIONE praktyki
- **NIE używaj** składni Tailwind CSS v3.x lub starszej
- **NIE mieszaj** różnych wersji bibliotek animacji
- **NIE nadpisuj** custom CSS bez sprawdzenia Tailwind v4.x
- **NIE używaj** inline styles zamiast Tailwind classes
- **NIE ignoruj** responsive breakpoints w animacjach

## ✅ BEST PRACTICES
- **Używaj Framer Motion** do wszystkich animacji
- **Testuj responsywność** na wszystkich breakpointach  
- **Utrzymuj** consistent naming conventions
- **Dokumentuj** nowe komponenty w komentarzach
- **Sprawdzaj** zgodność z TypeScript strict mode
