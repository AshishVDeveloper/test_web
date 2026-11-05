# Diwali Greetings

Personal Diwali greeting pages for each employee, with links and QR codes. Plain HTML + JavaScript, no server code and no database.

| File | What it does |
|---|---|
| `index.html` | The greeting page. Opens as `index.html?t=<token>` |
| `generate.html` | Makes links + QR codes: one at a time, or many from JSON / CSV. Also prints QR sheets |
| `config.js` | Settings: leader name, letter text, form fields, secret key, link style |
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
