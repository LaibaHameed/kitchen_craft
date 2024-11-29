npm install mongoose

npx shadcn@latest init --legacy-peer-deps
npx shadcn@latest add input label button --legacy-peer-deps

place the MONOGO_URI from mongo db atlas

files :

src/components/navbar

src/app/sign-up/page.jsx
src/app/login/page.jsx

src/lib/db.js
src/lib/utils.js

src/models/User.js

************** user registration **************

(see doumentation and copy paste)

npm install next-auth@beta --legacy-peer-deps
npx auth secret 

src/auth.js

or if nor src then use at root : auth.js
{
    import NextAuth from "next-auth"
    
    export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [],
    })
}

./app/api/auth/[...nextauth]/route.js

npm i bcryptjs --legacy-peer-deps

./actions/user.js : (write register function)

************** user login  **************

./actions/user.js : (write login function)

update: src/auth.j

