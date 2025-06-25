# Charlieverse - Tech Solutions Website

A modern, responsive website for Charlieverse, a tech startup offering comprehensive development services including web/app development, AI & ML solutions, cybersecurity, and academic project support.

## Features

- **Responsive Design**: Fully responsive across all devices
- **Modern UI/UX**: Dark theme with cyan and purple accents
- **Authentication**: Complete login and signup system
- **Interactive Components**: Smooth animations and hover effects
- **Professional Sections**: Hero, Services, About, Testimonials, Contact
- **Form Validation**: Client-side validation with error handling

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Development**: Hot Module Replacement (HMR)

## Prerequisites

Before running this project locally, make sure you have the following installed:

- **Node.js** (version 16.0 or higher)
- **npm** (comes with Node.js) or **yarn**

### Installing Node.js

#### Windows:
1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Run the installer and follow the setup wizard
3. Verify installation by opening Command Prompt and running:
   ```cmd
   node --version
   npm --version
   ```

#### macOS:
1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Run the installer package
3. Or install via Homebrew:
   ```bash
   brew install node
   ```
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

#### Linux (Ubuntu/Debian):
```bash
# Update package index
sudo apt update

# Install Node.js
sudo apt install nodejs npm

# Verify installation
node --version
npm --version
```

## Local Installation & Setup

### 1. Clone or Download the Project

If you have the project files, navigate to the project directory in your terminal/command prompt.

### 2. Install Dependencies

```bash
# Install all required dependencies
npm install
```

This will install all the packages listed in `package.json` including:
- React and React DOM
- TypeScript
- Tailwind CSS
- Vite
- Lucide React (for icons)
- ESLint (for code linting)

### 3. Start the Development Server

```bash
# Start the development server
npm run dev
```

The development server will start and you'll see output similar to:
```
  VITE v5.4.2  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 4. Open in Browser

Open your web browser and navigate to `http://localhost:5173/` to view the website.

## Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint for code quality checks
npm run lint
```

## Project Structure

```
charlieverse-website/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── About.tsx
│   │   ├── AuthWrapper.tsx
│   │   ├── Contact.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Login.tsx
│   │   ├── Services.tsx
│   │   ├── Signup.tsx
│   │   └── Testimonials.tsx
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # App entry point
│   └── index.css         # Global styles
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## Features Overview

### Authentication System
- **Login Page**: Email/password authentication with remember me option
- **Signup Page**: Complete registration form with validation
- **Form Validation**: Real-time validation with error messages
- **Responsive Design**: Works seamlessly on all devices

### Main Website Sections
- **Hero Section**: Compelling tagline with call-to-action buttons
- **Services**: Four main service categories with detailed descriptions
- **About Us**: Company mission, values, and team information
- **Testimonials**: Client success stories with ratings
- **Contact Form**: Professional contact form with project type selection
- **Footer**: Complete site navigation and social links

## Customization

### Colors
The website uses a custom color scheme defined in Tailwind CSS:
- **Primary**: Cyan (cyan-400, cyan-500, cyan-600)
- **Secondary**: Purple (purple-500, purple-600)
- **Background**: Gray shades (gray-800, gray-900)

### Content
To customize content, edit the respective component files in the `src/components/` directory.

### Styling
Modify `src/index.css` for global styles or individual component files for component-specific styling.

## Deployment

### Build for Production
```bash
npm run build
```

This creates a `dist/` folder with optimized production files.

### Deploy to Static Hosting
The built files can be deployed to any static hosting service like:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Firebase Hosting

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Kill process on port 5173
   npx kill-port 5173
   # Or use a different port
   npm run dev -- --port 3000
   ```

2. **Node modules issues**:
   ```bash
   # Clear npm cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScript errors**:
   ```bash
   # Check TypeScript configuration
   npx tsc --noEmit
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact:
- Email: hello@charlieverse.tech
- Phone: +1 (555) 123-4567

---

**Happy Coding! 🚀**# demp3
# demp3
# demp3
# demp3
