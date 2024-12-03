# Cook with Ingredients You Have

## Introduction

Welcome to the **Cook with Ingredients You Have** Recipe Application! This application is your trusty kitchen assistant, helping you make delicious dishes with the ingredients you already have in your pantry. It suggests recipes based on what you’ve got and even keeps track of your favorite meals.

## Key Features

- **Recipe Search by ingredients you  have:**  Type in ingredients you have, and get suggestions for recipes you can cook.
- **Recipe Search by name:** Find recipes based on the recipe name.
- **Favorites:** Save recipes that you love for easy access later.
- **Login Integration:** Secure login with Email & Password.

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/LaibaHameed/kitchen_craft.git

2. nstall dependencies:

    npm install

3. Set up environment variables:
    
    SPOONACULAR_API_KEY= YOUR_SPOONACULAR_API_KEY
    MONGO_URI= YOUR_MONGO_URI
    NEXTAUTH_SECRET= YOUR_SECRET
    NEXTAUTH_URL= http://localhost:3000
    jwtSecret= YOUR_SECRET

4. Run the app locally:

    npm run dev

## Ingredients (Tech Stack)

- **Frontend**: Next.js (React framework for creating dynamic and fast recipe displays)
- **Backend**:  Node.js + Express (for recipe handling and user data)
- **Database**: MongoDB (to store user data and saved recipes)
- **Authentication**: custom API
- **API Integration**: Spoonacular API to fetch the recipes

## How It Works

    The Cooking Process (App Flow):

- **Ingredients Input**: User inputs their ingredients into the search bar or logs in to personalize the experience.
- **Recipe Search**: The app fetches matching recipes from the Spoonacular API.
- **Recipe Display**: Recipes are displayed in a user-friendly grid, showing titles, images, and key details.
- **Favorite Recipes**: Users can save their favorite recipes for future reference.
- **User Login**: Users log in to save their favorites and have personalized recommendations.
- **Recipe Results Update**: Upon adding new ingredients or logging in, the results update dynamically.

## The Recipe (Project Structure)

/src
├── /app
│   ├── /auth
│   │   ├── login/page.jsx
│   │   └── sign-up/page.jsx
│   ├── /api
│   │   ├── /login
│   │   │   └── route.js
│   │   ├── /sign-up
│   │   │   └── route.js
│   │   ├── /autocomplete-ingredients
│   │   │   └── route.js
│   │   ├── /autocomplete-recipes
│   │   │   └── route.js
│   │   ├── /pantry
│   │   │   └── route.js
│   │   ├── /random-recipes
│   │   │   └── route.js
│   │   ├── /recipes
│   │   │   └── route.js
│   │   ├── /ingredients-recipes
│   │   │   └── route.js
│   │   ├── /recipe-info
│   │   │   └── route.js
│   │   ├── /favourites
│   │   │   └── route.js
│   ├── /favourites
│   │   └── page.jsx
│   ├── /get-ingredients-recipe
│   │   └── page.jsx
│   ├── /get-recipes
│   │   └── page.jsx
│   ├── /recipe-info/[id]
│   │   └── page.jsx
│   ├── layout.js
│   └── page.js
├── /components
│   ├── CuisineDropdown.jsx
│   ├── DietDropdown.jsx
│   ├── IngredientsPopup.jsx
│   ├── MealTypeDropdown.jsx
│   ├── Navbar.jsx
│   ├── Pantry.jsx
│   ├── ReadyTimeDropdown.jsx
│   ├── RecipeCard.jsx
│   ├── RecipeInfo.jsx
│   └── SearchBar.jsx
├── /lib
│   ├── baseUrl.js
│   ├── db.js
│   └── utils.js
├── /models
│   ├── Pantry.js
│   └── User.js
.env
README.md


## A Secret Sauce (Technologies Used)

- **Next.js**:  A framework that helps cook up fast, SEO-friendly pages.
- **Spoonacular API**: The secret recipe database that provides thousands of recipes.
- **MongoDB**: A flexible database to store user preferences and recipes.
- **Tailwind CSS**: The stylish garnish to make the app visually appealing.

## Chef’s Guide (Usage):
    How to Use the App (Cooking Instructions):

    Visit the app at (https://kitchen-craft-xi.vercel.app/).
    Log in with your Email and Password to keep your favorite recipes.
    Enter ingredients you already have in your kitchen and search for recipes.
    Browse through the results and click on your favorite recipe to get detailed instructions.
    Save your favorite recipes to revisit them later.
