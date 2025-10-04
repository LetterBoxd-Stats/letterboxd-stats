# Letterboxd Stats React App

This is a React App containing an interface to browse scraped [Letterboxd](https://letterboxd.com) user review data. It supports sorting both film and user data along with viewing fun statistical superlatives. All stats are pulled using a custom-built [Letterboxd API](https://github.com/LetterBoxd-Stats/letterboxd-api).

Deployed on [Vercel](https://vercel.com), and configurable via environment variables.

Production URL: https://letterboxd-stats-gules.vercel.app/

---

## Environment Variables

These variables are loaded via dotenv for local development and should also be added to your Vercel project settings for production.

| Secret Name                      | Description                                     |
| -------------------------------- | ----------------------------------------------- |
| `REACT_APP_API_URL`              | Letterboxd API base URL                         |
| `REACT_APP_FILMS_PER_PAGE`       | Number of films per page (optional, default 20) |
| `REACT_APP_LETTERBOXD_USERNAMES` | Comma-separated list of Letterboxd usernames    |

---

## Local Development

1. Clone the repo

2. Install dependencies:

```bash
npm install
```

4. Start the React app:

```bash
npm run start
```

---

## Project Structure

```bash
node_modules/          # (Not in repository)
├── *                  # Dependencies
public/
├── index.html
src/
├── api/
├── components/
    ├── ComingSoon.css
    ├── ComingSoon.js
    ├── Navbar.css
    ├── Navbar.js
    ├── films/
        ├── FilmFilterControls.css
        ├── FilmFilterControls.js
        ├── FilmList.css
        ├── FilmList.js
        ├── FilmSortingControls.css
        ├── FilmSortingControls.js
├── pages/
    ├── FilmsPage.css
    ├── FilmsPage.js
    ├── HomePage.css
    ├── HomePage.js
    ├── RecommenderPage.css
    ├── RecommenderPage.js
    ├── SuperlativesPage.css
    ├── SuperlativesPage.js
    ├── UserDetailPage.css
    ├── UserDetailPage.js
    ├── UsersPage.css
    ├── UsersPage.js
├── utils/
    ├── helpers.js
├── App.css
├── App.js
├── index.css
├── index.js
.env                   # Local environment variables (not in repository)
.gitignore
package-lock.json
package.json
README.md
```
