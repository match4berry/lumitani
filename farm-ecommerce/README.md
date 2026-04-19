# Farm E-commerce Application

A modern web-based e-commerce platform for farm products built with Node.js, Express, and EJS templating.

## Features

- **Product Catalog**: Browse farm products organized by categories
  - Sayuran (Vegetables)
  - Padi-padian (Grains)
  - Umbi-umbian (Roots & Tubers)
  - Buah-buahan (Fruits)
  - Bumbu-dapur (Kitchen Spices)

- **Product Details**: View detailed information about each product
- **Shopping Cart**: Add products to cart and manage quantities
- **Navigation**: Bottom navigation bar for easy access to main pages
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Pages

- **Home/Catalog**: Browse all products with category filtering
- **Product Detail**: View detailed product information
- **Cart**: Manage shopping cart items
- **About**: Learn about the platform
- **Profile**: User profile management

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- Docker (for containerized deployment)

## Installation

### Local Development

1. **Clone or navigate to the project directory**
   ```bash
   cd farm-ecommerce
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
   Navigate to `http://localhost:3000`

### Production

1. **Install production dependencies**
   ```bash
   npm install --production
   ```

2. **Start the server**
   ```bash
   npm start
   ```

## Docker Deployment

### Building Docker Image

```bash
docker build -t farm-ecommerce:latest .
```

### Running with Docker

```bash
docker run -p 3000:3000 farm-ecommerce:latest
```

### Running with Docker Compose

```bash
docker-compose up
```

The application will be available at `http://localhost:3000`

## Project Structure

```
farm-ecommerce/
├── src/
│   ├── server.js                 # Main Express server
│   └── controllers/
│       ├── productController.js  # Product management
│       └── cartController.js     # Cart management
├── views/                        # EJS templates
│   ├── catalog.ejs
│   ├── product-detail.ejs
│   ├── cart.ejs
│   ├── about.ejs
│   ├── profile.ejs
│   ├── 404.ejs
│   └── error.ejs
├── public/
│   ├── css/                      # Stylesheets
│   │   ├── style.css
│   │   ├── catalog.css
│   │   ├── product-detail.css
│   │   ├── cart.css
│   │   ├── about.css
│   │   └── profile.css
│   └── js/                       # Client-side scripts
│       ├── catalog.js
│       ├── product-detail.js
│       ├── cart.js
│       └── profile.js
├── data/                         # Data files
├── package.json                  # Dependencies
├── Dockerfile                    # Docker image definition
├── docker-compose.yml            # Docker Compose configuration
└── README.md                     # This file
```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with auto-reload (requires nodemon)

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: EJS, HTML, CSS, JavaScript
- **Styling**: Custom CSS with responsive design
- **Containerization**: Docker, Docker Compose

## Product Categories

1. **Sayuran (Vegetables)**: Fresh vegetables like tomatoes, spinach, broccoli
2. **Padi-padian (Grains)**: Rice, wheat, corn
3. **Umbi-umbian (Roots & Tubers)**: Sweet potato, potato, cassava
4. **Buah-buahan (Fruits)**: Mangoes, bananas, pineapples
5. **Bumbu-dapur (Kitchen Spices)**: Red chili, garlic, turmeric

## API Endpoints

- `GET /` - Home/Catalog page
- `GET /catalog` - Catalog with category filter (`?category=categoryName`)
- `GET /product/:id` - Product detail page
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/remove` - Remove item from cart
- `GET /cart` - Shopping cart page
- `GET /about` - About page
- `GET /profile` - Profile page

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Application environment (default: development)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For issues or questions, please create an issue in the repository.

---

**Happy Shopping! 🌾**
