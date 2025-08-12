# KidsDesignEcommerceFrontend

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})

## Project File Tree

```
.gitignore
README.md
components.json
eslint.config.js
index.html
package-lock.json
package.json
postcss.config.js
public\
├── _redirects
├── images\
│   ├── Empty-rafiki 1 (1).png
│   ├── Frame 1618876995 (1).png
│   ├── Frame 1618876996.png
│   ├── Symbol.svg.png
│   ├── Vector (2).png
│   ├── Vector (3).png
│   ├── banner.png
│   ├── beautiful-smiling-young-blonde-woman-pointing-sunglasses-holding-shopping-bags-credit-card-pink-wall 1 (1).png
│   ├── beautiful-smiling-young-blonde-woman-pointing-sunglasses-holding-shopping-bags-credit-card-pink-wall 1.png
│   ├── image 39 (1).png
│   ├── image2.png
│   ├── logo.png
│   ├── shutterstock_2081336278@2x 1 (2).png
│   ├── shutterstock_2081336278@2x 1 (3).png
│   └── shutterstock_2081336278@2x 1 (4).png
└── vite.svg
src\
├── App.css
├── App.tsx
├── admin\
│   ├── components\
│   ├── pages\
│   └── utils\
├── api\
│   └── axios.ts
├── assets\
│   └── react.svg
├── card\
│   ├── Ade.tsx
│   ├── Card.tsx
│   ├── SuggestedCard.tsx
│   ├── SuggestedWish.tsx
│   ├── Wish.tsx
│   ├── api.tsx
│   ├── types.tsx
│   └── wishListApi.tsx
├── components\
│   ├── Breadcrumb.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Pagination.tsx
│   ├── ProfileDropdown.tsx
│   ├── ScrollToTop.tsx
│   ├── SearchInput.tsx
│   ├── SortDropdown.tsx
│   ├── products\
│   └── ui\
├── index.css
├── lib\
│   └── utils.ts
├── main.tsx
├── pages\
│   ├── auth\
│   ├── cart\
│   ├── categories\
│   ├── filters\
│   ├── homepage\
│   └── orders\
├── routing\
│   ├── AdminPrivateRoute.tsx
│   ├── PrivateRoute.tsx
│   └── route.ts
├── types\
│   └── api-types.ts
├── utils\
│   └── cartStorage.ts
└── vite-env.d.ts
tailwind.config.js
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.ts
```
