# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (includes Tailwind CSS compilation)
- `npm test` - Run Jest tests in jsdom environment

### CSS and Styling
- `npm run tail` - Compile Tailwind CSS once
- `npm run tail:watch` - Watch and compile Tailwind CSS on changes

### Environment and Maintenance
- `npm run env` - Pull environment variables using dotenv-vault
- `npm run clean` - Clean install (removes node_modules and package-lock.json)

### Testing
- Tests are located in `src/components/__tests__/`
- Uses Jest with jsdom environment for component testing
- Run tests with `npm test`

## Architecture Overview

### Tech Stack
- **Frontend**: React 18 with functional components and hooks
- **Styling**: TailwindCSS with dark mode support
- **Build Tool**: Webpack 5 with custom configuration
- **Email Service**: Custom API integration via axios
- **Testing**: Jest with React Testing Library

### Project Structure
```
src/
├── App.js                    # Main app component with dark mode state
├── index.js                  # React app entry point
├── components/               # Reusable React components
│   ├── About.js             # About section
│   ├── Cards.js             # Skills cards display
│   ├── EmailSubmit.js       # Contact form with email integration
│   ├── Footer.js            # Site footer
│   ├── Navbar.js            # Navigation with dark mode toggle
│   ├── Projects.js          # Projects showcase
│   └── Skills.js            # Skills section
├── assets/                  # Static assets (images, fonts)
└── styles/                  # CSS files (input.css, output.css)
api/
└── sendMail.js              # Email sending functionality
```

### Key Features
- **Dark Mode**: Persistent dark/light theme with localStorage and system preference detection
- **Responsive Design**: Mobile-first approach using TailwindCSS
- **Email Integration**: Contact form sends emails via external API
- **Smooth Scrolling**: Uses react-scroll for navigation between sections
- **Component-Based**: Modular React components for maintainability

### Development Notes
- Environment variables are managed through `env.json` and dotenv-vault
- Webpack configuration includes Node.js polyfills for browser compatibility
- Custom font (Burtons) is loaded from assets
- Email functionality requires `ASSIST_EMAIL_URL` environment variable
- The app uses localStorage for dark mode preference persistence

### Build Configuration
- Webpack dev server runs on configurable port (default 3000)
- Production builds are optimized with performance hints disabled
- Source maps are enabled for development debugging
- File loader handles images, PDFs, and other assets

### Testing Strategy
- Component tests verify rendering and basic functionality
- Tests use `data-testid` attributes for reliable element selection
- Jest configuration includes jsdom for DOM testing