import { commonPackageName } from '@spacerocks/common';

export function startServer(): string {
  return `server placeholder using ${commonPackageName}`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(startServer());
}
