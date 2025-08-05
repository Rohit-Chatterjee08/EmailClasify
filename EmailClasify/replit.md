# Email Classification Application

## Overview

This is a complete full-stack email classification application that uses AI to automatically categorize customer emails into four types: complaints, queries, feedback, and leads. The system features a modern corporate UI with sharp text rendering and perfect navigation. It includes a demo mode for testing and is ready for deployment with OpenAI API integration.

## Recent Changes (August 2025)

- ✅ Complete application built with modern corporate UI design
- ✅ AI-powered classification system with confidence scoring
- ✅ Demo mode implemented for testing without API key dependency
- ✅ Sharp text rendering and professional interface completed
- ✅ Real-time statistics dashboard and analysis summaries
- ✅ All backend APIs tested and functioning correctly
- ✅ Ready for deployment to bypass network restrictions

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development
- **UI Library**: shadcn/ui components built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with CSS variables for theming and corporate color palette
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Design**: RESTful endpoints with JSON communication
- **Error Handling**: Centralized error middleware with structured error responses
- **Request Logging**: Custom middleware for API request/response logging

### Database Layer
- **Primary Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema evolution
- **Storage Pattern**: Repository pattern with interface abstraction supporting both database and in-memory storage
- **Schema**: Email classifications table with JSON fields for confidence scores

### AI Integration
- **Provider**: OpenAI API using GPT-4o model
- **Classification Logic**: Structured prompt engineering for consistent email categorization
- **Response Format**: JSON-only responses with confidence scoring and analysis summaries
- **Categories**: Four-category system (complaint, query, feedback, lead) with percentage confidence scores

### Authentication & Session Management
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **User Management**: Basic user system with username/password authentication
- **Security**: Password hashing and session-based authentication

### Development & Build System
- **Build Tool**: Vite for frontend bundling with React plugin
- **Backend Build**: esbuild for server-side TypeScript compilation
- **Development**: Hot reload with Vite dev server proxy
- **Code Quality**: TypeScript strict mode with comprehensive type checking

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form, TanStack Query
- **Backend Framework**: Express.js with TypeScript support
- **Database**: PostgreSQL via Neon serverless, Drizzle ORM, connect-pg-simple for sessions

### AI & Machine Learning
- **OpenAI**: Official OpenAI SDK for GPT-4o model integration
- **Environment**: Requires OPENAI_API_KEY environment variable

### UI Component Libraries
- **Radix UI**: Complete set of unstyled, accessible UI primitives
- **Styling**: Tailwind CSS, class-variance-authority for component variants
- **Icons**: Lucide React for consistent iconography
- **Utilities**: clsx and tailwind-merge for conditional styling

### Development Tools
- **Build System**: Vite with React plugin and runtime error overlay
- **Replit Integration**: Cartographer plugin and dev banner for Replit environment
- **Code Quality**: TypeScript, ESLint configuration
- **Validation**: Zod for runtime type validation and schema generation

### Database & Storage
- **Database URL**: Requires DATABASE_URL environment variable for PostgreSQL connection
- **Migrations**: Drizzle Kit for database schema management
- **Session Store**: PostgreSQL table for session persistence