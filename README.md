
# Sheheen's Portfolio

A modern, interactive portfolio website showcasing AI/ML projects, technical expertise, and professional experience. Built with React, TypeScript, and Vite for optimal performance.

**[🌐 Live Demo](https://sheheen-portfolio.vercel.app)**

---

## 🎯 About

Graduate AI Engineer passionate about building intelligent, real-world systems. This portfolio demonstrates expertise in:
- **Machine Learning & Deep Learning** – model development, data analysis
- **Computer Vision & Edge AI** – real-time system integration
- **Full-Stack Development** – frontend and backend architecture
- **Data Science** – practical, efficient, and impactful solutions

---

## ✨ Features

- **Responsive Design** – works seamlessly on desktop, tablet, and mobile
- **Smooth Animations** – motion effects with Framer Motion
- **Dark Theme** – optimized for modern web aesthetics
- **Project Showcase** – interactive project cards with links
- **Tech Stack Display** – categorized skills and technologies
- **Contact Integration** – easy ways to get in touch
- **Neural Background** – animated neural network visualization

---

## 🛠️ Tech Stack

### Frontend
- **React 18** – UI library
- **TypeScript** – type-safe development
- **Vite** – lightning-fast build tool
- **Tailwind CSS** – utility-first styling
- **Framer Motion** – smooth animations
- **Lucide Icons** – beautiful icon library

### Backend
- **Node.js** – runtime
- **Express** – web framework
- **CORS** – cross-origin support

### Design
- **Figma** – original design: [Portfolio Design](https://www.figma.com/design/vFDKBkjeDQdlK0tZAdiMmJ/SHEHEEN_PORTFOLIO)

---

## 📁 Project Structure

```
.
├── src/
│   ├── components/
│   │   ├── Hero.tsx          # Landing section with intro
│   │   ├── About.tsx         # About me section
│   │   ├── Projects.tsx      # Project showcase
│   │   ├── Experience.tsx    # Work & education history
│   │   ├── TechStack.tsx     # Skills & technologies
│   │   ├── Contact.tsx       # Contact section
│   │   ├── NeuralBackground.tsx  # Animated background
│   │   └── ui/               # Reusable UI components
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   └── styles/               # Global styles
├── backend/
│   ├── server.js             # Express server
│   └── package.json          # Backend dependencies
├── index.html                # HTML template
├── vite.config.ts            # Vite configuration
└── package.json              # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation & Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/sheheenmtp/sheheen-portfolio.git
   cd sheheen-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production**
   ```bash
   npm run build
   ```

### Running the Backend

```bash
cd backend
npm install
npm start
```
Backend runs on `http://localhost:3000` by default.

### Testing Backend

```bash
cd backend
npm test
```

---

## 🌐 Deployment

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Vercel will auto-detect Vite configuration
3. Set build command: `npm run build`
4. Deploy automatically on every push to `main`

**Current Deployment:** [vercel.com](https://sheheen-portfolio.vercel.app)

### Environment Variables

Create a `.env` file for local development:
```
VITE_API_URL=http://localhost:3000
```

---

## 📝 Key Files

- [Hero Component](src/components/Hero.tsx) – Landing page with animated name
- [About Component](src/components/About.tsx) – Bio and key highlights
- [Projects Component](src/components/Projects.tsx) – Featured projects
- [Tech Stack Component](src/components/TechStack.tsx) – Skills and tools
- [Backend Server](backend/server.js) – API endpoints

---

## 🎨 Customization

### Change Name Title Color

Edit [src/components/Hero.tsx](src/components/Hero.tsx):
```tsx
// Find the className with gradient
className="inline-block bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-transparent"

// Change gradient colors:
// from-blue-700 → starting color
// via-blue-600 → middle color
// to-blue-500 → ending color
```

### Update Content

- **About:** [src/components/About.tsx](src/components/About.tsx)
- **Projects:** [src/components/Projects.tsx](src/components/Projects.tsx)
- **Experience:** [src/components/Experience.tsx](src/components/Experience.tsx)
- **Contact:** [src/components/Contact.tsx](src/components/Contact.tsx)

---

## 📞 Contact

- **Email:** [Your Email]
- **LinkedIn:** [Your LinkedIn]
- **GitHub:** [@sheheenmtp](https://github.com/sheheenmtp)
- **Twitter/X:** [Your Handle]

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Attributions

See [ATTRIBUTIONS.md](src/Attributions.md) for libraries and resources used.

---

**Happy coding! 🚀**
  