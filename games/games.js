/*
  The list of games. Both games/index.html and the home page (index.html) are built from it.
  To add a game: put its page in this folder and add one line below.
    file: the page in games/   icon: an emoji   name / about: text on the card
*/
var GAMES = [
  { file: 'snake.html',        icon: '🐍', name: 'Snake',             about: 'Classic snake with boosters, settings and full screen.' },
  { file: 'snake-multy.html',  icon: '🎮', name: 'Multiplayer Snake', about: 'Up to 8 players in a room, on any network.' },
  { file: 'snake_ladder.html', icon: '🎲', name: 'Snake & Ladder',    about: '2–4 players, humans or computer, fixed or random board.' },
  { file: 'sudoku.html',       icon: '🔢', name: 'Sudoku',            about: 'Four levels, notes, hints, undo and best times.' }
];

/** Fills `box` with one link card per game. `base` is the path to the games folder ('' or 'games/'). */
function renderGames(box, base) {
  box.textContent = '';
  GAMES.forEach(function (g) {
    var a = document.createElement('a');
    a.className = 'card';
    a.href = (base || '') + g.file;
    var ic = document.createElement('div'); ic.className = 'ic'; ic.textContent = g.icon;
    var h = document.createElement('h2'); h.textContent = g.name;
    var p = document.createElement('p'); p.textContent = g.about;
    a.append(ic, h, p);
    box.appendChild(a);
  });
}
