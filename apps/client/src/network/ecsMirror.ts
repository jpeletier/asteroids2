import { Client, type Room } from 'colyseus.js';
import type { Component } from '@vworlds/vecs';
import {
  ECS_DELTA_MESSAGE,
  ECS_SNAPSHOT_MESSAGE,
  UNIVERSE_ROOM_NAME,
  type ComponentSnapshot,
  type EcsDeltaMessage,
  type EcsSnapshotMessage,
} from '@spacerocks/common';
import { world } from '../world';

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

    for (const componentType of removal.componentTypes) {
      entity.remove(componentType);
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
  entity.set(component.componentType, component.data as Partial<Component>);
}
