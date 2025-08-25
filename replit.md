# Overview

Boomerang is a healthcare application designed specifically for elderly users to manage medications, track health metrics, and access curated health information. The application emphasizes accessibility with large fonts, simple navigation, and clear visual design. Built as a full-stack web application, it features medication reminders, health monitoring, goal tracking, and a user-friendly interface optimized for seniors.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built with React 18 and TypeScript, using Vite as the build tool for fast development and optimized production builds. The application follows a component-based architecture with:

- **UI Framework**: Utilizes shadcn/ui components with Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom color schemes optimized for elderly users (medical green primary, high contrast colors)
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

## Backend Architecture

The backend follows a RESTful API design built with Express.js and TypeScript:

- **Server Framework**: Express.js with TypeScript for type safety
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Structure**: RESTful endpoints organized by feature (medications, health metrics, appointments)
- **Middleware**: Express middleware for JSON parsing, CORS, and request logging

## Authentication System

Uses Replit's OpenID Connect (OIDC) authentication system with Passport.js:

- **Strategy**: OAuth2/OIDC flow with Replit as the identity provider
- **Session Management**: PostgreSQL-backed session storage using connect-pg-simple
- **Security**: HTTP-only cookies with secure flags and proper session expiration

## Data Storage

PostgreSQL database with Neon serverless hosting for scalability:

- **Schema Design**: Normalized relational schema with foreign key constraints
- **Core Entities**: Users, medications, medication schedules, health metrics, health goals, appointments
- **Migration Strategy**: Drizzle Kit for database migrations and schema management

## Key Features Architecture

### Medication Management
- Medication tracking with dosage, frequency, and scheduling
- Medication logs for adherence monitoring
- Reminder system (planned for future implementation)

### Health Monitoring
- Health metrics tracking (blood pressure, heart rate, weight, etc.)
- Goal setting and progress tracking
- Visual dashboards for health trends

### Accessibility Design
- Large text sizes and high contrast colors
- Simple navigation patterns optimized for elderly users
- Mobile-responsive design with bottom navigation
- Emergency contact features prominently displayed

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Database Driver**: @neondatabase/serverless for optimized serverless connections

## Authentication Services
- **Replit Auth**: OpenID Connect provider for user authentication
- **Passport.js**: Authentication middleware with openid-client strategy

## UI and Styling
- **Radix UI**: Accessible component primitives (@radix-ui/* packages)
- **Tailwind CSS**: Utility-first CSS framework with custom theming
- **Lucide React**: Icon library for consistent iconography

## Development Tools
- **Vite**: Build tool and development server with React plugin
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast bundling for production builds

## Third-party Libraries
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation for form inputs and API responses
- **date-fns**: Date manipulation and formatting utilities