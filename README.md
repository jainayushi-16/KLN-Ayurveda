# SPYLT - Protein Drink Landing Page

A modern, interactive landing page for SPYLT protein drinks built with Next.js and GSAP animations. Features smooth scrolling, dynamic flavor sections, and a fully responsive design.

![SPYLT Screenshot](./public/images/spylt.png)

**[Click here to visit the live web app](https://spylt-1pvi.vercel.app/)**

## Overview

SPYLT is a premium protein drink brand landing page showcasing 6 delicious flavors with smooth animations, interactive sections, and a modern user experience. The site features hero videos, flavor sliders, nutrition information, testimonials, and more.

## Technologies Used

### Core Framework
- **Next.js 16.1.1** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript 5** - Type-safe JavaScript

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Custom Fonts** - Proxima Nova & Antonio (Google Fonts)
- **Lucide React** - Icon library

### Animation & Interactions
- **GSAP 3.14.2** - Professional animation library
- **@gsap/react** - React integration for GSAP
- **ScrollSmoother** - Smooth scrolling effects
- **ScrollTrigger** - Scroll-based animations

### Utilities
- **react-responsive** - Responsive design hooks
- **dayjs** - Date manipulation library

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## Features

- Smooth scroll animations powered by GSAP ScrollSmoother
- Interactive flavor slider showcasing 6 different flavors
- Hero section with video background
- Nutrition information display
- Benefits section with animated cards
- Testimonial carousel
- Fully responsive design
- Video pinning components
- Custom clip-path text effects
- Dynamic navigation bar

## Project Structure

```
spylt/
├── frontend/                   # Next.js 16 Client Application
│   ├── public/                 # Static assets (images, videos, fonts)
│   ├── src/                    # App Router pages, components, services, state
│   ├── .env                    # Frontend environment variables
│   ├── jsconfig.json           # JS path aliases
│   ├── next.config.mjs         # Next.js configuration
│   └── package.json            # Frontend dependencies & scripts
├── backend/                    # Node.js / Express API Application
│   ├── prisma/                 # Prisma DB schema & seed scripts
│   ├── src/                    # Controllers, modules, middleware, config
│   ├── .env                    # Backend environment variables
│   └── package.json            # Backend dependencies & scripts
├── package.json                # Root workspace script manager
└── README.md                   # Project documentation
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository and install all dependencies:
```bash
npm run install:all
```

2. Run the development servers:

- **Frontend (Next.js)**:
```bash
npm run dev:frontend
```
- **Backend (Express API)**:
```bash
npm run dev:backend
```

- Alternatively, run `npm run dev` inside `frontend` or `backend` directly.

## Available Root Scripts

- `npm run dev:frontend` - Start Next.js frontend dev server
- `npm run dev:backend` - Start Express backend dev server
- `npm run build:frontend` - Build frontend for production
- `npm run start:frontend` - Start production frontend server
- `npm run start:backend` - Start production backend server
- `npm run install:all` - Install dependencies for both frontend and backend

## Key Sections

### Hero Section
- Video background
- Animated call-to-action
- Smooth scroll integration

### Flavor Section
- Interactive slider with 6 flavors
- Dynamic color themes
- Smooth transitions

### Nutrition Section
- Display of key nutrients
- Animated counters
- Visual data presentation

### Benefits Section
- Key product benefits
- Icon-based cards
- Scroll-triggered animations

### Testimonial Section
- Social proof display
- Video testimonials
- Carousel functionality

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Optimized images and videos
- Code splitting with Next.js
- Smooth 60fps animations
- Lazy loading components

## Deployment

The project is deployed on Vercel. [Click here to visit the live web app](https://spylt-1pvi.vercel.app/)

To deploy your own version:

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables if needed
4. Deploy

Built with Next.js, React, TypeScript, GSAP, and Tailwind CSS
