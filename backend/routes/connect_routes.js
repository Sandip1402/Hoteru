import fs from 'node:fs';
import path from 'node:path';


// to connect all apis with express app at once, not individually
export default function registerRoutes(app, prisma) {
    // read all files in /apis folder
  const Files = fs.readdirSync(__dirname);

  Files.forEach(file => {
    // skiping itself
    if (file === "connect_routes.js") return;
    if (path.extname(file) !== '.js') return;

    // loading each file
    const makeRouter = require(path.join(__dirname, file));
    const router = makeRouter(prisma);

    app.use(`/api/${path.basename(file, '.js')}`, router);
  });
};
