import { Room, type Client } from 'colyseus';
import { Component, World, type Entity } from '@vworlds/vecs';
import {
  Arc,
  Drawable,
  ECS_DELTA_MESSAGE,
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
  type EcsDeltaMessage,
  type EcsSnapshotMessage,
  type NetworkEntityId,
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
  name: string;
  component: typeof Component;
  serialize: (value: T) => Record<string, unknown>;
};

function replicatedComponent<T extends Component>(
  def: ReplicatedComponentDef<T>,
): ReplicatedComponentDef<Component> {
  return {
    id: def.id,
    name: def.name,
    component: def.component,
    serialize: (value) => def.serialize(value as T),
  };
}

const networkComponentDefs = [
  replicatedComponent({
    id: NetworkComponentId.Position,
    name: 'Position',
    component: Position,
    serialize: (value: Position) => ({ x: value.x, y: value.y }),
  }),
  replicatedComponent({
    id: NetworkComponentId.Rotation,
    name: 'Rotation',
    component: Rotation,
    serialize: (value: Rotation) => ({ angle: value.angle }),
  }),
  replicatedComponent({
    id: NetworkComponentId.Drawable,
    name: 'Drawable',
    component: Drawable,
    serialize: (value: Drawable) => ({ zIndex: value.zIndex }),
  }),
  replicatedComponent({
    id: NetworkComponentId.Arc,
    name: 'Arc',
    component: Arc,
    serialize: (value: Arc) => ({
      radius: value.radius,
      startAngle: value.startAngle,
      endAngle: value.endAngle,
    }),
  }),
  replicatedComponent({
    id: NetworkComponentId.Shape,
    name: 'Shape',
    component: Shape,
    serialize: (value: Shape) => ({ points: value.points }),
  }),
  replicatedComponent({
    id: NetworkComponentId.StrokeStyle,
    name: 'StrokeStyle',
    component: StrokeStyle,
    serialize: (value: StrokeStyle) => ({
      style: value.style,
      lineWidth: value.lineWidth,
    }),
  }),
  replicatedComponent({
    id: NetworkComponentId.FillStyle,
    name: 'FillStyle',
    component: FillStyle,
    serialize: (value: FillStyle) => ({ style: value.style }),
  }),
  replicatedComponent({
    id: NetworkComponentId.FilledRect,
    name: 'FilledRect',
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

type PendingPatches = Map<
  NetworkEntityId,
  Map<NetworkComponentId, ComponentSnapshot>
>;

export class UniverseRoom extends Room {
  private readonly world = new World();
  private readonly simulationPhase = this.world.addPhase('simulation');
  private readonly replicationPhase = this.world.addPhase('replication');
  private readonly sendPhase = this.world.addPhase('send');
  private readonly spawned = new Set<NetworkEntityId>();
  private readonly removed = new Set<NetworkEntityId>();
  private readonly patches: PendingPatches = new Map();
  private readonly componentRemoved = new Map<
    NetworkEntityId,
    Set<NetworkComponentId>
  >();
  private tick = 0;

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

    for (const def of networkComponentDefs) {
      this.world.registerComponent(def.component, def.id);
    }
  }

  private registerSystems(): void {
    this.world
      .system('DebugMotion')
      .phase(this.simulationPhase)
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
      .phase(this.simulationPhase)
      .requires(Arc, StrokeStyle)
      .interval(2)
      .each([StrokeStyle], (_entity, [strokeStyle]) => {
        strokeStyle.style = randomDebugColor(strokeStyle.style);
        strokeStyle.modified();
      });

    this.registerReplicationSystems();

    this.world
      .system('SendDeltas')
      .phase(this.sendPhase)
      .rate(3)
      .run(() => {
        this.broadcastDelta();
      });
  }

  private registerReplicationSystems(): void {
    this.world
      .system('ReplicateNetworkedLifecycle')
      .phase(this.replicationPhase)
      .requires(Networked)
      .enter([Networked], (_entity, [networked]) => {
        this.markEntitySpawned(networked.id);
      })
      .exit([Networked], (_entity, [networked]) => {
        this.markEntityRemoved(networked.id);
      });

    for (const def of networkComponentDefs) {
      this.registerComponentReplicationSystem(def);
    }
  }

  private registerComponentReplicationSystem(
    def: ReplicatedComponentDef<Component>,
  ): void {
    this.world
      .system(`Replicate${def.name}`)
      .phase(this.replicationPhase)
      .requires(Networked, def.component)
      .update(def.component, [Networked], (component, [networked]) => {
        if (!networked) return;
        this.markComponentPatch(networked.id, def.id, def.serialize(component));
      })
      .exit([Networked, def.component], (_entity, [networked]) => {
        this.markComponentRemoved(networked.id, def.id);
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

  private broadcastDelta(): void {
    if (!this.hasDelta()) return;

    this.broadcast(ECS_DELTA_MESSAGE, this.createDelta());
    this.clearDelta();
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

    for (const def of networkComponentDefs) {
      const component = entity.get(def.component);
      if (!component) continue;

      components.push({
        componentId: def.id,
        data: def.serialize(component),
      });
    }

    return components;
  }

  private markEntitySpawned(id: NetworkEntityId): void {
    if (this.removed.delete(id)) return;
    this.spawned.add(id);
  }

  private markEntityRemoved(id: NetworkEntityId): void {
    this.removed.add(id);
    this.spawned.delete(id);
    this.patches.delete(id);
    this.componentRemoved.delete(id);
  }

  private markComponentPatch(
    id: NetworkEntityId,
    componentId: NetworkComponentId,
    data: Record<string, unknown>,
  ): void {
    if (this.removed.has(id)) return;

    const removedComponents = this.componentRemoved.get(id);
    removedComponents?.delete(componentId);
    if (removedComponents?.size === 0) this.componentRemoved.delete(id);

    const entityPatches = this.patches.get(id) ?? new Map();
    entityPatches.set(componentId, { componentId, data });
    this.patches.set(id, entityPatches);
  }

  private markComponentRemoved(
    id: NetworkEntityId,
    componentId: NetworkComponentId,
  ): void {
    if (this.removed.has(id) || this.spawned.has(id)) return;

    const entityPatches = this.patches.get(id);
    entityPatches?.delete(componentId);
    if (entityPatches?.size === 0) this.patches.delete(id);

    const removedComponents = this.componentRemoved.get(id) ?? new Set();
    removedComponents.add(componentId);
    this.componentRemoved.set(id, removedComponents);
  }

  private hasDelta(): boolean {
    return (
      this.spawned.size > 0 ||
      this.removed.size > 0 ||
      this.patches.size > 0 ||
      this.componentRemoved.size > 0
    );
  }

  private createDelta(): EcsDeltaMessage {
    return {
      tick: this.tick,
      spawned: [...this.spawned],
      removed: [...this.removed],
      patches: [...this.patches].map(([id, components]) => ({
        id,
        components: [...components.values()],
      })),
      componentRemoved: [...this.componentRemoved].map(
        ([id, componentIds]) => ({
          id,
          componentIds: [...componentIds],
        }),
      ),
    };
  }

  private clearDelta(): void {
    this.spawned.clear();
    this.removed.clear();
    this.patches.clear();
    this.componentRemoved.clear();
  }
}

function randomDebugColor(current: string): string {
  const next = DEBUG_COLORS[Math.floor(Math.random() * DEBUG_COLORS.length)]!;
  return next === current ? randomDebugColor(current) : next;
}
