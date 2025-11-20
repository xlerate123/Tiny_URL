# URL Shortener

A modern, full-featured URL shortener built with Next.js, Prisma, and PostgreSQL.

## Features

- **Create Short Links**: Shorten URLs with auto-generated or custom short codes (6-8 alphanumeric characters)
- **Click Tracking**: Monitor total clicks and last-clicked timestamp for each link
- **Link Management**: View, search, filter, and delete your shortened links
- **Stats Dashboard**: Detailed analytics for individual links
- **Modern UI**: Beautiful, responsive design with dark mode support

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud like Neon)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd url_shortener
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/url_shortener?schema=public"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

For Neon (cloud Postgres):
```env
DATABASE_URL="postgres://user:password@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require"
```

4. Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

### Links Management

- `POST /api/links` - Create a new short link
  - Body: `{ originalUrl: string, shortCode?: string }`
  - Returns: Link object or 409 if code exists
  
- `GET /api/links` - Get all links
  
- `GET /api/links/:code` - Get stats for a specific link
  
- `DELETE /api/links/:code` - Delete a link

### System

- `GET /healthz` - Health check endpoint (returns 200)

### Redirect

- `GET /:code` - Redirect to original URL (302) and increment click count

## Routes

- `/` - Dashboard (list, create, delete links)
- `/code/:code` - Stats page for a specific link
- `/:code` - Redirect to original URL
- `/healthz` - Health check

## Database Schema

```prisma
model Link {
  id            Int       @id @default(autoincrement())
  originalUrl   String
  shortCode     String    @unique
  clicks        Int       @default(0)
  lastClickedAt DateTime?
  createdAt     DateTime  @default(now())
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables:
   - `DATABASE_URL` (your Neon or PostgreSQL connection string)
   - `NEXT_PUBLIC_BASE_URL` (your production URL)
4. Deploy!

### Other Platforms (Render, Railway)

1. Connect your GitHub repository
2. Set environment variables
3. Build command: `npm run build`
4. Start command: `npm start`

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run Prisma Studio (database GUI)
npx prisma studio
```

## Validation Rules

- **URL**: Must be a valid HTTP/HTTPS URL
- **Short Code**: 6-8 alphanumeric characters [A-Za-z0-9]
- **Uniqueness**: Short codes must be globally unique

## License

MIT
