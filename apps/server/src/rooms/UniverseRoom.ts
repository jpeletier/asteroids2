import { Room, type Client } from 'colyseus';
import { Component, World, type Entity } from '@vworlds/vecs';
import {
  Arc,
  Drawable,
  ECS_SNAPSHOT_MESSAGE,
  FillStyle,
  FilledRect,
  NetworkComponentId,
  Networked,
  Position,
  Rotation,
  Shape,
  StrokeStyle,
  type ComponentSnapshot,
  type EcsSnapshotMessage,
} from '@spacerocks/common';
import { logger } from '../logger';

class DebugMotion extends Component {
  centerX = 0;
  centerY = 0;
  orbitRadius = 0;
  angularSpeed = 1;
  phase = 0;
}

type ReplicatedComponentDef<T extends Component> = {
  id: NetworkComponentId;
  component: typeof Component;
  serialize: (value: T) => Record<string, unknown>;
};

function replicatedComponent<T extends Component>(
  def: ReplicatedComponentDef<T>,
): ReplicatedComponentDef<Component> {
  return {
    id: def.id,
    component: def.component,
    serialize: (value) => def.serialize(value as T),
  };
}

const replicatedComponents = [
  replicatedComponent({
    id: NetworkComponentId.Position,
    component: Position,
    serialize: (value: Position) => ({ x: value.x, y: value.y }),
  }),
  replicatedComponent({
    id: NetworkComponentId.Rotation,
    component: Rotation,
    serialize: (value: Rotation) => ({ angle: value.angle }),
  }),
  replicatedComponent({
    id: NetworkComponentId.Drawable,
    component: Drawable,
    serialize: (value: Drawable) => ({ zIndex: value.zIndex }),
  }),
  replicatedComponent({
    id: NetworkComponentId.Arc,
    component: Arc,
    serialize: (value: Arc) => ({
      radius: value.radius,
      startAngle: value.startAngle,
      endAngle: value.endAngle,
    }),
  }),
  replicatedComponent({
    id: NetworkComponentId.Shape,
    component: Shape,
    serialize: (value: Shape) => ({ points: value.points }),
  }),
  replicatedComponent({
    id: NetworkComponentId.StrokeStyle,
    component: StrokeStyle,
    serialize: (value: StrokeStyle) => ({
      style: value.style,
      lineWidth: value.lineWidth,
    }),
  }),
  replicatedComponent({
    id: NetworkComponentId.FillStyle,
    component: FillStyle,
    serialize: (value: FillStyle) => ({ style: value.style }),
  }),
  replicatedComponent({
    id: NetworkComponentId.FilledRect,
    component: FilledRect,
    serialize: (value: FilledRect) => ({
      width: value.width,
      height: value.height,
    }),
  }),
];

const DEBUG_COLORS = [
  '#00ffcc',
  '#ff00ff',
  '#ffaa00',
  '#66ff66',
  '#66aaff',
  '#ff6666',
] as const;

export class UniverseRoom extends Room {
  private readonly world = new World();
  private tick = 0;
  private lastBroadcastTick = 0;

  override onCreate(): void {
    logger.info({ roomId: this.roomId }, 'universe room created');

    this.autoDispose = false;
    this.registerComponents();
    this.registerSystems();
    this.world.start();
    this.createDebugEntities();

    this.setSimulationInterval((deltaTime) => {
      this.tick++;
      this.world.progress(performance.now(), deltaTime);

      if (this.tick - this.lastBroadcastTick >= 3) {
        this.lastBroadcastTick = this.tick;
        this.broadcastSnapshot();
      }
    }, 1000 / 60);
  }

  override onJoin(client: Client): void {
    logger.info(
      { roomId: this.roomId, sessionId: client.sessionId },
      'client connected to universe room',
    );

    client.send(ECS_SNAPSHOT_MESSAGE, this.createSnapshot());
  }

  override onLeave(client: Client, consented?: boolean): void {
    logger.info(
      { roomId: this.roomId, sessionId: client.sessionId, consented },
      'client disconnected from universe room',
    );
  }

  private registerComponents(): void {
    this.world.registerComponent(Networked, 1000);
    this.world.registerComponent(DebugMotion, 1001);

    for (const def of replicatedComponents) {
      this.world.registerComponent(def.component, def.id);
    }
  }

  private registerSystems(): void {
    this.world
      .system('DebugMotion')
      .requires(Position, DebugMotion)
      .run((now) => {
        const seconds = now / 1000;
        this.world
          .filter([Position, DebugMotion])
          .forEach([Position, DebugMotion], (_entity, [position, motion]) => {
            const angle = seconds * motion.angularSpeed + motion.phase;
            position.x = motion.centerX + Math.cos(angle) * motion.orbitRadius;
            position.y = motion.centerY + Math.sin(angle) * motion.orbitRadius;
            position.modified();
          });
      });

    this.world
      .system('DebugColor')
      .requires(Arc, StrokeStyle)
      .interval(2)
      .each([StrokeStyle], (_entity, [strokeStyle]) => {
        strokeStyle.style = randomDebugColor(strokeStyle.style);
        strokeStyle.modified();
      });
  }

  private createDebugEntities(): void {
    this.createDebugCircle(1, 260, 220, 90, 0.8, 0, '#00ffcc', 24);
    this.createDebugCircle(2, 520, 320, 70, -1.1, 1.5, '#ff00ff', 18);
    this.createDebugCircle(3, 780, 240, 110, 0.55, 3, '#ffaa00', 32);
  }

  private createDebugCircle(
    id: number,
    centerX: number,
    centerY: number,
    orbitRadius: number,
    angularSpeed: number,
    phase: number,
    color: string,
    radius: number,
  ): void {
    const startAngle = 0;
    const endAngle = Math.PI * 2;

    this.world
      .entity()
      .set(Networked, { id })
      .set(Position, { x: centerX + orbitRadius, y: centerY })
      .set(DebugMotion, { centerX, centerY, orbitRadius, angularSpeed, phase })
      .set(Drawable, { zIndex: 10 })
      .set(Arc, { radius, startAngle, endAngle })
      .set(StrokeStyle, { style: color, lineWidth: 3 });
  }

  private broadcastSnapshot(): void {
    this.broadcast(ECS_SNAPSHOT_MESSAGE, this.createSnapshot());
  }

  private createSnapshot(): EcsSnapshotMessage {
    const entities: EcsSnapshotMessage['entities'] = [];

    this.world.filter([Networked]).forEach((entity) => {
      const networked = entity.get(Networked);
      if (!networked) return;

      entities.push({
        id: networked.id,
        components: this.serializeEntity(entity),
      });
    });

    return {
      tick: this.tick,
      entities,
      removed: [],
    };
  }

  private serializeEntity(entity: Entity): ComponentSnapshot[] {
    const components: ComponentSnapshot[] = [];

    for (const def of replicatedComponents) {
      const component = entity.get(def.component);
      if (!component) continue;

      components.push({
        componentId: def.id,
        data: def.serialize(component),
      });
    }

    return components;
  }
}

function randomDebugColor(current: string): string {
  const next = DEBUG_COLORS[Math.floor(Math.random() * DEBUG_COLORS.length)]!;
  return next === current ? randomDebugColor(current) : next;
}
