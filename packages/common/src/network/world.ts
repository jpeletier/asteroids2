import { World, type Component } from '@vworlds/vecs';
import {
  Arc,
  Drawable,
  FillStyle,
  FilledRect,
  type ISerializable,
  Networked,
  Position,
  Rotation,
  Shape,
  StrokeStyle,
} from '../components';

type SharedComponentTypeEntry = readonly [typeof Component, number];

export const SHARED_COMPONENT_TYPES = [
  [Position, 0],
  [Rotation, 1],
  [Drawable, 2],
  [Arc, 3],
  [Shape, 4],
  [StrokeStyle, 5],
  [FillStyle, 6],
  [FilledRect, 7],
  [Networked, 8],
] satisfies readonly SharedComponentTypeEntry[];

export type ComponentType = number;

export type SerializableComponentClass = typeof Component & {
  prototype: Component & ISerializable;
};

export const SERIALIZABLE_COMPONENTS = SHARED_COMPONENT_TYPES.map(
  ([ComponentClass]) => ComponentClass,
).filter(
  (ComponentClass) => ComponentClass !== Networked,
) as SerializableComponentClass[];

export type SharedSerializableComponent = InstanceType<
  (typeof SERIALIZABLE_COMPONENTS)[number]
>;

type CreateWorldOptions = {
  entityIdStart?: number;
};

export function createWorld(options: CreateWorldOptions = {}): World {
  const world = new World();
  registerSharedComponents(world);

  if (options.entityIdStart !== undefined) {
    world.setEntityIdRange(options.entityIdStart);
  }

  return world;
}

export function registerSharedComponents(world: World): void {
  for (const [ComponentClass, type] of SHARED_COMPONENT_TYPES) {
    world.registerComponent(ComponentClass, type);
  }
}
