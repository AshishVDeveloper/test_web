/*
 * config.js — settings shared by index.html (greeting page) and generate.html (link + QR maker).
 * Edit this one file; both pages read it.
 */
window.GREETING_CONFIG = {
  // Used to sign every link. Change it to your own text before you make real links.
  // NOTE: this is a static site, so anyone who opens this file can read the key.
  // It stops people from simply editing a link, not a determined person.
  SECRET_KEY: 'change-this-secret-key-2026',
  SIG_LENGTH: 10,

  // Signature at the end of every letter. Used when a link has no Leader Name / Leader Title of its own.
  LEADER_NAME: 'Ashish Chawan',
  LEADER_TITLE: 'Team Leader',

  // Photo used when the link has no Image URL. {key} = name in lowercase with "_"
  // (Rahul Sharma -> images/rahul_sharma.jpg). .jpg, .jpeg, .png and .webp are all tried.
  IMAGE_PATTERN: 'images/{key}.jpg',

  // The letter shown to everyone. Each item is a paragraph.
  MESSAGE: [
    'On this auspicious occasion of Diwali, I want to take a moment to appreciate your dedication, sincerity and the positive energy you bring to our team every day.',
    'Your hard work and commitment truly make a difference.',
    'May this festival of lights illuminate your life with joy, prosperity and new opportunities.',
  ],

  // Fields shown in the generator form (key: label). Add/remove freely.
  FIELDS: {
    name: 'Employee Name',
    department: 'Department',
    leader: 'Leader Name (optional)',
    leader_title: 'Leader Title (optional)',
    image: 'Image URL (optional)',
  },

  // Other column names accepted in JSON/CSV for the fields above
  ALIASES: {
    'emp name': 'name', 'emp_name': 'name', 'employee name': 'name', 'employee_name': 'name',
    'dept': 'department',
    'leader name': 'leader', 'leader_name': 'leader', 'team lead': 'leader', 'team leader': 'leader', 'from': 'leader',
    'leader title': 'leader_title', 'title': 'leader_title', 'designation': 'leader_title', 'lead title': 'leader_title',
    'image url': 'image', 'image_url': 'image', 'img': 'image', 'photo': 'image',
  },

  // Address of the greeting page used in generated links. Empty = the folder this site is opened from.
  // Example: 'https://yourname.github.io/test_web/'
  BASE_URL: 'https://ashishvdeveloper.github.io/test_web/',

  // 'query' -> https://site/?t=<token>   (works on any host, recommended)
  // 'path'  -> https://site/<token>      (shorter; needs GitHub Pages (404.html) or Apache (.htaccess))
  LINK_STYLE: 'query',
};
