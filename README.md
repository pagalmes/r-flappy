# Flappy Turtle Game

A fun and addictive Flappy Turtle game built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- 🐢 Classic Flappy gameplay with a cute flying turtle
- 🎯 Score tracking with high score persistence
- 🎨 Beautiful graphics and smooth animations
- 📱 Responsive design
- ⌨️ Keyboard and mouse controls
- 🚀 Built with modern web technologies

## Game Controls

- **Click** on the game canvas to make the turtle jump
- **Press SPACEBAR** to make the turtle jump
- Avoid the pipes and keep the turtle flying!

## Tech Stack

- **Next.js 16** - React framework for production
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **HTML Canvas** - For game rendering

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd r-flappy
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to play the game!

## Building for Production

To create a production build:

```bash
npm run build
npm start
```

## Deploy to Vercel

The easiest way to deploy this Flappy Turtle game is using [Vercel](https://vercel.com):

### Option 1: Deploy with Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Click "Deploy"

That's it! Your Flappy Turtle game will be live on Vercel.

### Deploy Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/r-flappy)

## Game Mechanics

- **Gravity**: The turtle constantly falls due to gravity
- **Jump**: Each jump gives the turtle an upward velocity
- **Pipes**: Randomly generated pipes move from right to left
- **Collision**: Game ends if the turtle hits a pipe, ground, or ceiling
- **Scoring**: Earn 1 point for each pipe successfully passed

## Development

### Project Structure

```
r-flappy/
├── app/
│   ├── layout.tsx       # Root layout with metadata
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/
│   └── FlappyBird.tsx   # Main game component
├── public/              # Static assets
└── package.json         # Dependencies
```

### Customization

You can customize the game by modifying constants in `components/FlappyBird.tsx`:

- `GAME_WIDTH` / `GAME_HEIGHT` - Canvas dimensions
- `BIRD_SIZE` - Size of the turtle
- `PIPE_WIDTH` - Width of pipes
- `PIPE_GAP` - Gap between top and bottom pipes
- `GRAVITY` - How fast the turtle falls
- `JUMP_STRENGTH` - How high the turtle jumps
- `PIPE_SPEED` - How fast pipes move

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for learning and fun!

## Acknowledgments

- Inspired by the original Flappy Bird game by Dong Nguyen
- Built with modern React and Next.js best practices

---

Enjoy the game! 🐢🎮
