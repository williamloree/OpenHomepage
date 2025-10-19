# OpenHomepage

A customizable, self-hosted homepage dashboard built with Nuxt 4 and Vue 3. Create your perfect landing page with configurable sections, links, and widgets.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Nuxt](https://img.shields.io/badge/Nuxt-4.1-00DC82?logo=nuxt.js)
![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)

## Features

- **Customizable Sections**: Organize your links into themed sections with custom icons
- **Link Management**: Add, edit, and reorder links with ease
- **Widget System**: Integrate external services and display real-time data
- **Admin Dashboard**: Intuitive interface for managing your homepage
- **Dark Mode**: Built-in dark/light theme support
- **Responsive Design**: Beautiful on desktop, tablet, and mobile
- **Self-Hosted**: Keep your data private and under your control
- **Docker Support**: Easy deployment with Docker and Docker Compose

## Widgets

OpenHomepage includes a variety of widgets to enhance your dashboard:

- **Clock Widget**: Real-time clock display
- **Weather Widget**: Current weather data (Open-Meteo API)
- **Quote Widget**: Display custom quotes
- **Stats Widget**: Statistics cards with icons
- **Pinger Widget**: Monitor URL availability
- **Caddy Stats Widget**: Caddy web server integration
- **Portainer Widget**: Docker container management
- **Uptime Kuma Widget**: Uptime monitoring integration
- **Custom Widget**: Flexible widget with customizable properties

## Tech Stack

- **Frontend**: Vue 3 (Composition API) + Nuxt 4
- **Styling**: Tailwind CSS v4 + Nuxt UI
- **Type Safety**: TypeScript
- **Backend**: Nitro (Nuxt Server Engine)
- **Database**: JSON file-based storage
- **Deployment**: Docker, Docker Compose

## Quick Start

### Prerequisites

- Node.js 18+ or Docker

### Installation

#### Using npm

```bash
# Clone the repository
git clone https://github.com/williamloree/OpenHomepage.git
cd OpenHomepage

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and set your admin password
# ADMIN_PASSWORD=your_secure_password

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

#### Using Docker

```bash
# Clone the repository
git clone https://github.com/williamloree/OpenHomepage.git
cd OpenHomepage

# Create environment file
cp .env.example .env

# Edit .env and set your admin password
# ADMIN_PASSWORD=your_secure_password

# Start with Docker Compose
docker-compose up -d
```

Visit [http://localhost:3000](http://localhost:3000)

See [DOCKER.md](DOCKER.md) for detailed Docker deployment instructions.

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
ADMIN_PASSWORD=your_secure_password
NODE_ENV=production
```

### Data Persistence

All data is stored in `server/db/data.json`. Make sure to back up this file or mount it as a volume in Docker.

## Usage

### Accessing the Admin Panel

1. Navigate to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Enter your admin password (from `.env`)
3. Manage sections, links, and widgets

### Managing Sections

- **Add Section**: Click "Add Section" and provide a title and icon
- **Edit Section**: Click the edit icon on any section
- **Delete Section**: Click the delete icon
- **Reorder Sections**: Use the up/down arrows

### Managing Links

- **Add Link**: Click "Add Link" in any section
- **Edit Link**: Click the edit icon on any link
- **Delete Link**: Click the delete icon
- **Customize Icons**: Use [Lucide icon names](https://lucide.dev/icons/)

### Managing Widgets

- **Add Widget**: Click "Add Widget" in any section
- **Configure Widget**: Fill in the widget properties
- **Delete Widget**: Click the delete icon

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Generate static site
npm run generate
```

## Project Structure

```text
OpenHomepage/
├── app/
│   ├── assets/           # CSS and images
│   ├── components/       # Vue components
│   ├── composables/      # Vue composables (state management)
│   ├── middleware/       # Route middleware
│   ├── pages/            # Application pages
│   └── widgets/          # Widget components
├── server/
│   ├── api/              # API endpoints
│   └── db/               # Database (JSON)
├── public/               # Static assets
├── Dockerfile            # Docker image
├── docker-compose.yml    # Docker Compose config
└── nuxt.config.ts        # Nuxt configuration
```

## API Endpoints

### Sections API

- `GET /api/sections` - Get all sections
- `POST /api/sections` - Create a section
- `PUT /api/sections` - Update a section
- `DELETE /api/sections` - Delete a section

### Links API

- `GET /api/links` - Get all links
- `POST /api/links` - Create a link
- `PUT /api/links` - Update a link
- `DELETE /api/links` - Delete a link
- `PATCH /api/links` - Reorder links

### Widgets API

- `GET /api/widgets` - Get all widgets
- `POST /api/widgets` - Create a widget
- `DELETE /api/widgets` - Delete a widget

### Authentication API

- `POST /api/auth/login` - Admin login

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Nuxt](https://nuxt.com/)
- UI components from [Nuxt UI](https://ui.nuxt.com/)
- Icons from [Lucide](https://lucide.dev/)
- Weather data from [Open-Meteo](https://open-meteo.com/)

## Support

If you encounter any issues or have questions:

- Open an [issue](https://github.com/williamloree/OpenHomepage/issues)
- Check the [documentation](https://github.com/williamloree/OpenHomepage/wiki)

## Roadmap

- [ ] User authentication system
- [ ] Multiple user profiles
- [ ] Import/export configurations
- [ ] More widget types
- [ ] Theme customization
- [ ] Plugin system

---

Made with ❤️ by the OpenHomepage community
