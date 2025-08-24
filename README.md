# Thrifty Clothing Frontend

A modern e-commerce frontend for Thrifty Clothing built with React, featuring essential fashion products for everyone.

## Features

- 🛍️ **Product Catalog** - Browse essential clothing items
- 🔍 **Category Filtering** - Filter products by category (Men, Women, etc.)
- 🛒 **Shopping Cart** - Add items to cart functionality
- ❤️ **Wishlist** - Save favorite products
- 👤 **User Authentication** - Firebase authentication integration
- 📱 **Responsive Design** - Mobile-first design with Tailwind CSS
- 🎨 **Modern UI** - Clean and intuitive user interface

## Tech Stack

- **React** - Frontend framework
- **Tailwind CSS** - Styling and responsive design
- **Firebase** - Authentication and backend services
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Shaurya1608/Thrifty-Clothing-Frontend.git
cd Thrifty-Clothing-Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add your Firebase configuration:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Header, etc.)
│   └── ...            # Other components
├── contexts/           # React contexts for state management
├── pages/              # Page components
├── utils/              # Utility functions and helpers
├── firebase.js         # Firebase configuration
└── App.js              # Main App component
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

Shaurya1608 - [@Shaurya1608](https://github.com/Shaurya1608)

Project Link: [https://github.com/Shaurya1608/Thrifty-Clothing-Frontend](https://github.com/Shaurya1608/Thrifty-Clothing-Frontend)
