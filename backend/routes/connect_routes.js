import { dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// to connect all apis with express app at once, not individually
export default async function registerRoutes(app, prisma) {
    // read all files in /routes folder
  const Files = readdirSync(__dirname);

  for (const file of Files) {
    // skipping itself
    if (file === "connect_routes.js") continue;
    if (extname(file) !== '.js') continue;

    // loading each file dynamically
    const moduleExport = await import(`./${file}`);
    const makeRouter = moduleExport.default;
    const router = makeRouter(prisma);

    app.use(`/api/${basename(file, '.js')}`, router);
  }
}
