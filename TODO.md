# Advanced Restaurant Discovery System - Implementation Plan

## Project Overview

Implement a complete Advanced Restaurant Discovery System with location, cuisine, and dish/menu management along with advanced search and filtering capabilities.

---

## Phase 1: Backend Models & Database

### 1.1 Update Restaurant Model (Location System)

- [ ] Add `city` field (required)
- [ ] Add `area` field
- [ ] Add `fullAddress` field
- [ ] Add `latitude` field (DECIMAL)
- [ ] Add `longitude` field (DECIMAL)
- [ ] Update existing model: Backend/models/venueModel.js

### 1.2 Create Cuisine Model

- [ ] Create: Backend/models/cuisineModel.js
- [ ] Fields: id, name (unique, required)
- [ ] Create: Backend/models/restaurantCuisineModel.js (junction table)
- [ ] Update: Backend/index.js to define associations

### 1.3 Create Dish/Menu Model

- [ ] Create: Backend/models/dishModel.js
- [ ] Fields: name, price, description, category (Veg/Non-Veg/Dessert/Beverage), restaurantId
- [ ] Define Restaurant hasMany Dish relationship

---

## Phase 2: Backend Controllers & Routes

### 2.1 Cuisine Controller

- [ ] Create: Backend/controllers/cuisineController.js
- [ ] Create CRUD operations: createCuisine, getAllCuisines, updateCuisine, deleteCuisine

### 2.2 Cuisine Routes

- [ ] Create: Backend/routes/cuisineRoute.js
- [ ] Endpoints: GET, POST, PUT, DELETE /api/cuisine

### 2.3 Restaurant-Cuisine Association Routes

- [ ] POST /api/restaurant/:id/cuisines - Assign cuisines to restaurant
- [ ] GET /api/restaurant/:id/cuisines - Get cuisines for restaurant
- [ ] DELETE /api/restaurant/:id/cuisines/:cuisineId - Remove cuisine from restaurant

### 2.4 Dish Controller

- [ ] Create: Backend/controllers/dishController.js
- [ ] Create CRUD operations: createDish, getDishesByRestaurant, updateDish, deleteDish

### 2.5 Dish Routes

- [ ] Create: Backend/routes/dishRoute.js
- [ ] Endpoints: GET, POST, PUT, DELETE /api/dishes

### 2.6 Update Restaurant Controller (Advanced Filtering)

- [ ] Update: Backend/controllers/venueController.js
- [ ] Add query parameter support: city, area, cuisine, dish, minRating, minPrice, maxPrice
- [ ] Implement Sequelize include and where conditions

---

## Phase 3: Frontend Services & API

### 3.1 Update API Service

- [ ] Update: frontend/src/services/api.js
- [ ] Add: getAllCuisines, createCuisine, updateCuisine, deleteCuisine
- [ ] Add: getRestaurantCuisines, assignCuisinesToRestaurant
- [ ] Add: getDishesByRestaurant, createDish, updateDish, deleteDish
- [ ] Update: getAllRestaurants to accept filter params

---

## Phase 4: Frontend Components

### 4.1 Create Filter Component

- [ ] Create: frontend/src/pages/components/RestaurantFilters.jsx
- [ ] City dropdown (auto-populated from restaurants)
- [ ] Cuisine dropdown (from cuisine API)
- [ ] Dish search input
- [ ] Price range filter (min/max sliders)
- [ ] Minimum rating filter (star rating)
- [ ] Mobile responsive design

### 4.2 Create Dish/Menu Component

- [ ] Create: frontend/src/pages/users/RestaurantMenu.jsx
- [ ] Display dishes grouped by category
- [ ] Show dish details (name, price, description)
- [ ] Filter by category

### 4.3 Update Venues Page

- [ ] Update: frontend/src/pages/users/Venues.jsx
- [ ] Integrate RestaurantFilters component
- [ ] Implement auto-fetch on filter change
- [ ] Add loading states
- [ ] Add "No results found" UI
- [ ] Add sorting options (Highest Rated, Lowest Price, Newest)

---

## Phase 5: Bonus Features

### 5.1 Top Rated Badge

- [ ] Add visual badge for restaurants with rating >= 4.5
- [ ] Display on restaurant cards

### 5.2 Most Popular Cuisine Section

- [ ] Calculate most popular cuisine from restaurant data
- [ ] Add section in Home.jsx or Venues.jsx

### 5.3 Sorting Options

- [ ] Highest Rated
- [ ] Lowest Price
- [ ] Newest (by creation date)

---

## Implementation Order

1. Backend Models (Restaurant update → Cuisine → Dish)
2. Backend Index (associations)
3. Cuisine Controller & Routes
4. Dish Controller & Routes
5. Restaurant Controller (filtering)
6. Frontend API updates
7. Frontend Filter Component
8. Frontend Menu Component
9. Integration & Testing

---

## API Endpoints Summary

### Cuisine

- `GET /api/cuisine` - Get all cuisines
- `POST /api/cuisine` - Create cuisine (admin)
- `PUT /api/cuisine/:id` - Update cuisine (admin)
- `DELETE /api/cuisine/:id` - Delete cuisine (admin)

### Restaurant-Cuisine

- `POST /api/restaurant/:id/cuisines` - Assign cuisines
- `GET /api/restaurant/:id/cuisines` - Get restaurant cuisines
- `DELETE /api/restaurant/:id/cuisines/:cuisineId` - Remove cuisine

### Dish

- `GET /api/dishes?restaurantId=1` - Get dishes by restaurant
- `POST /api/dishes` - Create dish (admin)
- `PUT /api/dishes/:id` - Update dish (admin)
- `DELETE /api/dishes/:id` - Delete dish (admin)

### Restaurant (Updated)

- `GET /api/restaurant?city=&area=&cuisine=&dish=&minRating=&minPrice=&maxPrice=&sort=`
