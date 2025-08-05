# 🎮 Pokemon Collection App

A modern, responsive Pokemon discovery and collection app built with Next.js, React Query, and TypeScript. Discover Pokemon with infinite scrolling, build your personal collection, and reorder them with drag and drop functionality.

![Pokemon Collection App](https://img.shields.io/badge/React-19.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-purple)

## ✨ Features

### 🎯 Core Functionality
- **Infinite Scrolling**: Discover Pokemon with automatic loading as you scroll
- **Personal Collection**: Add Pokemon to your collection with one click
- **Drag & Drop**: Reorder your collection with modern drag and drop
- **Persistent Storage**: Your collection is automatically saved to localStorage
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop

### 🎨 UI/UX Features
- **Modern Design**: Beautiful gradient backgrounds and smooth animations
- **Type-based Colors**: Each Pokemon type has its own color scheme
- **Loading States**: Elegant loading animations and error handling
- **Accessibility**: Full keyboard navigation and screen reader support
- **Real-time Updates**: Collection count updates instantly

### 🔧 Technical Features
- **React Query**: Efficient data fetching and caching
- **TypeScript**: Full type safety throughout the application
- **Intersection Observer**: Optimized infinite scrolling
- **Modern Drag & Drop**: Using @dnd-kit (replaces deprecated react-beautiful-dnd)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd pokemon-collection
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
app/
├── components/
│   ├── PokemonApp.tsx          # Main app with navigation
│   ├── PokemonDiscovery.tsx    # Discovery page with infinite scroll
│   ├── PokemonCollection.tsx   # Collection with drag & drop
│   └── PokemonCard.tsx         # Individual Pokemon card
├── services/
│   ├── pokemonApi.ts           # API service for Pokemon data
│   └── collectionService.ts    # localStorage management
├── types/
│   └── pokemon.ts              # TypeScript interfaces
├── providers.tsx               # React Query provider
├── layout.tsx                  # App layout with providers
├── page.tsx                    # Main page
└── globals.css                 # Global styles
```

## 🎮 How to Use

### Discovery Page
1. **Browse Pokemon**: Scroll through the infinite list of Pokemon
2. **Add to Collection**: Click the green (+) button on any Pokemon card
3. **View Details**: Each card shows Pokemon name, types, and stats (HP, Attack, Defense)

### Collection Page
1. **View Collection**: Switch to the "Collection" tab to see your saved Pokemon
2. **Reorder**: Drag and drop Pokemon cards to change their order
3. **Remove**: Click the red (×) button to remove Pokemon from your collection
4. **Persistent**: Your collection automatically saves and persists across browser sessions

## 🛠️ Technologies Used

- **Frontend Framework**: Next.js 15 with App Router
- **UI Library**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4
- **Data Fetching**: TanStack Query (React Query)
- **Drag & Drop**: @dnd-kit/core and @dnd-kit/sortable
- **Infinite Scrolling**: react-intersection-observer
- **API**: PokeAPI (https://pokeapi.co/)

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect Next.js and deploy

### Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `.next` folder to Netlify
   - Or connect your GitHub repository

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Environment Variables

No environment variables required - the app uses public APIs.

## 🎨 Customization

### Styling
- Modify `app/globals.css` for global styles
- Update Tailwind classes in components for component-specific styling
- Pokemon type colors are defined in `app/services/pokemonApi.ts`

### Adding Features
- New components can be added to `app/components/`
- API services can be extended in `app/services/`
- Types can be added to `app/types/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **PokeAPI**: For providing the Pokemon data
- **@dnd-kit**: For the modern drag and drop functionality
- **TanStack**: For React Query
- **Vercel**: For the amazing Next.js framework

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Made with ❤️ and lots of Pokemon!**
