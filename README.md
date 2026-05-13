# Languager - Language Practice App

A Vue 3 flashcard app for practicing languages with beautiful, interactive cards.

## Features

- 📚 **Collection Management**: Browse and select different language collections
- 🎴 **Flashcard Practice**: Interactive flip cards to practice vocabulary
- 📊 **Progress Tracking**: See your progress through each collection
- 🎨 **Beautiful UI**: Modern gradient design with smooth animations
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

This will create a `dist/` folder with optimized files for production.

## Project Structure

```
src/
├── components/
│   ├── CollectionList.vue    # Main screen showing all collections
│   └── PracticeScreen.vue    # Flashcard practice screen
├── App.vue                   # Root component
├── main.js                   # Entry point
└── stores.js                 # Application state & sample data
```

## How to Use

1. **Start**: The app opens with a collection selection screen
2. **Select**: Click "Start Practice" on any collection
3. **Practice**: Click a card to flip and reveal the answer
4. **Navigate**: Use Previous/Next buttons to move between cards
5. **Return**: Click "Back to Collections" to return to the selection screen

## Customizing Collections

Edit `src/stores.js` to add, modify, or remove collections and flashcards:

```javascript
{
  id: 1,
  name: 'Spanish Basics',
  language: 'Spanish',
  cards: [
    { id: 1, front: 'Hello', back: 'Hola' },
    { id: 2, front: 'Thank you', back: 'Gracias' }
  ]
}
```

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next generation frontend tooling
- **CSS3** - Modern styling with gradients and animations

## License

MIT
