import { Client, type Room } from 'colyseus.js';
import {
  ECS_DELTA_MESSAGE,
  ECS_SNAPSHOT_MESSAGE,
  NetworkComponentId,
  UNIVERSE_ROOM_NAME,
  type ComponentSnapshot,
  type EcsDeltaMessage,
  type EcsSnapshotMessage,
} from '@spacerocks/common';
import { world } from '../world';
import {
  Arc,
  Drawable,
  FillStyle,
  FilledRect,
  Position,
  Rotation,
  Shape,
  StrokeStyle,
} from '../components/index';

type SnapshotData = ComponentSnapshot['data'];

let room: Room | null = null;

export async function connectEcsMirror(): Promise<void> {
  const endpoint = getServerEndpoint();
  const client = new Client(endpoint);

  try {
    room = await client.joinOrCreate(UNIVERSE_ROOM_NAME);
    room.onMessage<EcsSnapshotMessage>(ECS_SNAPSHOT_MESSAGE, applySnapshot);
    room.onMessage<EcsDeltaMessage>(ECS_DELTA_MESSAGE, applyDelta);
    room.onLeave(() => {
      room = null;
    });
    console.info(`Connected to ECS mirror at ${endpoint}`);
  } catch (error) {
    console.warn(`ECS mirror unavailable at ${endpoint}`, error);
  }
}

function getServerEndpoint(): string {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.hostname}:2567`;
}

function applySnapshot(snapshot: EcsSnapshotMessage): void {
  for (const entityId of snapshot.removed) {
    world.entity(entityId)?.destroy();
  }

  for (const entitySnapshot of snapshot.entities) {
    const entity = world.getOrCreateEntity(entitySnapshot.id);
    for (const component of entitySnapshot.components) {
      applyComponent(entity, component);
    }
  }
}

function applyDelta(delta: EcsDeltaMessage): void {
  for (const entityId of delta.spawned) {
    world.getOrCreateEntity(entityId);
  }

  for (const patch of delta.patches) {
    const entity = world.getOrCreateEntity(patch.id);
    for (const component of patch.components) {
      applyComponent(entity, component);
    }
  }

  for (const removal of delta.componentRemoved) {
    const entity = world.entity(removal.id);
    if (!entity) continue;

    for (const componentId of removal.componentIds) {
      removeComponent(entity, componentId);
    }
  }

  for (const entityId of delta.removed) {
    world.entity(entityId)?.destroy();
  }
}

function applyComponent(
  entity: ReturnType<typeof world.getOrCreateEntity>,
  component: ComponentSnapshot,
): void {
  const data = component.data;

  switch (component.componentId) {
    case NetworkComponentId.Position:
      entity.set(Position, {
        x: getNumber(data, 'x', 0),
        y: getNumber(data, 'y', 0),
      });
      break;
    case NetworkComponentId.Rotation:
      entity.set(Rotation, { angle: getNumber(data, 'angle', 0) });
      break;
    case NetworkComponentId.Drawable:
      entity.set(Drawable, { zIndex: getNumber(data, 'zIndex', 0) });
      break;
    case NetworkComponentId.Arc:
      entity.set(Arc, {
        radius: getNumber(data, 'radius', 10),
        startAngle: getNumber(data, 'startAngle', 0),
        endAngle: getNumber(data, 'endAngle', Math.PI * 2),
      });
      break;
    case NetworkComponentId.Shape:
      entity.set(Shape, { points: getPoints(data) });
      break;
    case NetworkComponentId.StrokeStyle:
      entity.set(StrokeStyle, {
        style: getString(data, 'style', '#fff'),
        lineWidth: getNumber(data, 'lineWidth', 2),
      });
      break;
    case NetworkComponentId.FillStyle:
      entity.set(FillStyle, { style: getString(data, 'style', '#fff') });
      break;
    case NetworkComponentId.FilledRect:
      entity.set(FilledRect, {
        width: getNumber(data, 'width', 2),
        height: getNumber(data, 'height', 2),
      });
      break;
  }
}

function removeComponent(
  entity: ReturnType<typeof world.getOrCreateEntity>,
  componentId: NetworkComponentId,
): void {
  switch (componentId) {
    case NetworkComponentId.Position:
      entity.remove(Position);
      break;
    case NetworkComponentId.Rotation:
      entity.remove(Rotation);
      break;
    case NetworkComponentId.Drawable:
      entity.remove(Drawable);
      break;
    case NetworkComponentId.Arc:
      entity.remove(Arc);
      break;
    case NetworkComponentId.Shape:
      entity.remove(Shape);
      break;
    case NetworkComponentId.StrokeStyle:
      entity.remove(StrokeStyle);
      break;
    case NetworkComponentId.FillStyle:
      entity.remove(FillStyle);
      break;
    case NetworkComponentId.FilledRect:
      entity.remove(FilledRect);
      break;
  }
}

function getNumber(data: SnapshotData, key: string, fallback: number): number {
  const value = data[key];
  return typeof value === 'number' ? value : fallback;
}

function getString(data: SnapshotData, key: string, fallback: string): string {
  const value = data[key];
  return typeof value === 'string' ? value : fallback;
}

function getPoints(data: SnapshotData): { x: number; y: number }[] {
  const points = data.points;
  if (!Array.isArray(points)) return [];

  return points
    .map((point) => {
      if (!point || typeof point !== 'object') return null;
      const candidate = point as Record<string, unknown>;
      const x = candidate.x;
      const y = candidate.y;
      if (typeof x !== 'number' || typeof y !== 'number') return null;
      return { x, y };
    })
    .filter((point): point is { x: number; y: number } => point !== null);
}
