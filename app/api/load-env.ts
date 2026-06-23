import { loadEnvFile } from 'node:process';
import path from 'node:path';

try {
  loadEnvFile(path.join(process.cwd(), '.env'));
} catch {
  // Copy .env.example to .env in this directory.
}
