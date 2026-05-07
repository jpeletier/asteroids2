import { Server } from 'colyseus';
import { UniverseRoom } from './rooms/UniverseRoom';
import { UNIVERSE_ROOM_NAME } from '@spacerocks/common';
import { logger } from './logger';

export async function startServer(port = Number(process.env.PORT ?? 2567)) {
  const gameServer = new Server({ greet: false });
  gameServer.define(UNIVERSE_ROOM_NAME, UniverseRoom);

  await gameServer.listen(port);
  return { gameServer, port };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer()
    .then(({ port }) => {
      logger.info(
        { port },
        `spacerocks server listening on ws://localhost:${port}`,
      );
    })
    .catch((error: unknown) => {
      logger.error({ error }, 'failed to start spacerocks server');
      process.exitCode = 1;
    });
}
