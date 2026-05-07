export const UNIVERSE_ROOM_NAME = 'universe';
export const ECS_SNAPSHOT_MESSAGE = 'ecs:snapshot';
export const CLIENT_ENTITY_ID_START = 1_000_000;

export const NetworkComponentId = {
  Position: 1,
  Rotation: 2,
  Drawable: 3,
  Arc: 4,
  Shape: 5,
  StrokeStyle: 6,
  FillStyle: 7,
  FilledRect: 8,
} as const;

export type NetworkComponentId =
  (typeof NetworkComponentId)[keyof typeof NetworkComponentId];

export type NetworkEntityId = number;

export type ComponentSnapshot = {
  componentId: NetworkComponentId;
  data: Record<string, unknown>;
};

export type EntitySnapshot = {
  id: NetworkEntityId;
  components: ComponentSnapshot[];
};

export type EcsSnapshotMessage = {
  tick: number;
  entities: EntitySnapshot[];
  removed: NetworkEntityId[];
};
