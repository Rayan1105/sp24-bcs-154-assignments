const fs = require('fs');
const path = require('path');

const folders = [
  'models',
  'routes',
  'controllers',
  'middleware',
  'views',
  'views/admin',
  'public/uploads'
];

folders.forEach(folder => {
  const folderPath = path.join(__dirname, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Created: ${folder}`);
  } else {
    console.log(`Already exists: ${folder}`);
  }
});
