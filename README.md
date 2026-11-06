# Diwali Greetings

Personal Diwali greeting pages for each employee, with links and QR codes. Plain HTML + JavaScript, no server code and no database.

| File | What it does |
|---|---|
| `index.html` | The greeting page. Opens as `index.html?t=<token>` |
| `generate.html` | Makes links + QR codes: one at a time, or many from JSON / CSV. Also prints QR sheets |
| `config.js` | Settings: default From Name / From Role (each link can set its own), letter text, form fields, secret key, link style |
| `token.js` | Creates and checks the tokens |
| `images/` | Employee photos, named after the employee: `rahul_sharma.jpg` for "Rahul Sharma" |
| `404.html` | GitHub Pages only: makes short links `/<token>` and `/generate` work |
| `.htaccess` | Apache only: the same short links |

## How it works

The employee's name, department and image are stored **inside the link** (compressed and signed), so nothing needs to be saved anywhere.

1. Open `generate.html`.
2. Enter a name (or paste a list), click **Generate**.
3. Share the link or the QR code. The person opening it sees their own greeting.

Photos: if no Image URL is given, the page looks for `images/<name>.jpg` (also `.jpeg`, `.png`, `.webp`). If there is none, it shows the person's initials.

## Run it

- **GitHub Pages:** Settings → Pages → Deploy from branch → `main` / root. Live at https://ashishvdeveloper.github.io/test_web/ (generator: `/generate`).
- **On your computer:** open `generate.html` in the browser, or put the folder in XAMPP's `htdocs`.

## Note about the secret key

Because this is a static site, `config.js` (including `SECRET_KEY`) can be read by anyone who visits. The signature stops people from simply editing a link to change the name, but someone who reads the code could make their own links. Change `SECRET_KEY` to your own text before making real links (old links stop working when you change it).

## File Sharing

`file-sharing.html` sends files straight from one browser to another, on any network. One person clicks **Share files** and gets a code, link and QR code; the other opens it. Files go directly between the browsers with [PeerJS](https://peerjs.com/), not through a server. Both sides can send, and several people can join one code. Keep the page open until the transfer finishes. Received files are held in memory until saved, so very large files (over about 1 GB) may fail, especially on phones.

## Games

Also in this site, in the `games/` folder (plain HTML + JavaScript, no server):

| Page | Game |
|---|---|
| `games/` | Menu of all games (also shown on the home page when it is opened without a personal link) |
| `games/games.js` | The list of games both menus are built from. Add a line here when you add a game |
| `games/snake.html` | Snake. High score is saved in your browser |
| `games/snake-multy.html` | Multiplayer Snake, up to 8 players per room. The first player in a room hosts the game in their browser (keep that tab open); others join with the same room name from any network. Uses [PeerJS](https://peerjs.com/) to connect the browsers |
| `games/snake_ladder.html` | Snake & Ladder, 2–4 players or computer. Wins are saved in your browser |
| `games/sudoku.html` | Sudoku with 4 levels. Puzzles are made in the browser; best times are saved in your browser |
