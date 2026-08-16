import { dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const Files = readdirSync(__dirname);

// to connect all apis with express app at once, not individually
export default async function registerRoutes(app) {
  // read all files in /routes folder

  for (const file of Files) {
    // skipping itself
    if (file === "loader.js") continue;
    if (!file.endsWith(".routes.js")) continue;

    // loading each file dynamically
    const module = await import(`./${file}`);

    app.use(
      `/api/${file.replace(".routes.js", "")}`,
      module.default()
    );
  }
}
