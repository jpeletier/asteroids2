import type { ComponentType } from './world';

export const UNIVERSE_ROOM_NAME = 'universe';
export const ECS_SNAPSHOT_MESSAGE = 'ecs:snapshot';
export const ECS_DELTA_MESSAGE = 'ecs:delta';
export const CLIENT_ENTITY_ID_START = 1_000_000;

export type NetworkEntityId = number;

export type ComponentSnapshot = {
  componentType: ComponentType;
  data: Record<string, unknown>;
};

export type EntitySnapshot = {
  id: NetworkEntityId;
  components: ComponentSnapshot[];
};

export type EntityPatch = {
  id: NetworkEntityId;
  components: ComponentSnapshot[];
};

export type ComponentRemoval = {
  id: NetworkEntityId;
  componentTypes: ComponentType[];
};

export type EcsSnapshotMessage = {
  tick: number;
  entities: EntitySnapshot[];
  removed: NetworkEntityId[];
};

export type EcsDeltaMessage = {
  tick: number;
  spawned: NetworkEntityId[];
  patches: EntityPatch[];
  removed: NetworkEntityId[];
  componentRemoved: ComponentRemoval[];
};
