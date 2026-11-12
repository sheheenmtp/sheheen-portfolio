/**
 * Lets Node run the api/ TypeScript sources directly (tests and scripts, with Node's
 * built-in type stripping). api/ files import each other with `.js` specifiers, which
 * is what Vercel's compiled functions need at runtime; this maps such a specifier to
 * the `.ts` file next to it when no `.js` file exists.
 *
 *   node --import ./scripts/resolve-ts.mjs …
 */
import { existsSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { fileURLToPath } from 'node:url';

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (/^\.{1,2}\/.*\.js$/.test(specifier) && context.parentURL?.startsWith('file:')) {
      const js = new URL(specifier, context.parentURL);
      if (!existsSync(fileURLToPath(js))) {
        const ts = new URL(specifier.replace(/\.js$/, '.ts'), context.parentURL);
        if (existsSync(fileURLToPath(ts))) return nextResolve(ts.href, context);
      }
    }
    return nextResolve(specifier, context);
  },
});
