import { cloneDeepWith } from 'lodash';
import { DynamicControl, DynamicFormConfig } from '../dynamic-forms.type';

function hasNestedPaths(path: unknown[]): boolean {
  return path.length > 1;
}

function isTargetPath(path: unknown[]): boolean {
  return path.length === 1;
}

function sortByOrder(obj: { [key: string]: { order: number } }) {
  const keys = Object.keys(obj).sort(
    (key1, key2) => obj[key1].order - obj[key2].order,
  );
  return keys.reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});
}

export function addProperty(
  object: DynamicFormConfig,
  receivedObject: { [key: string]: DynamicControl },
  targetKey: string,
) {
  if (!targetKey) {
    const controls = sortByOrder({
      ...object.controls,
      ...receivedObject,
    });
    return {
      ...object,
      controls,
    };
  }

  const path = targetKey.split('.');

  return cloneDeepWith(object, (value, key, obj) =>
    addPropertyCustomizer(value, key, obj, receivedObject, path),
  ) as DynamicFormConfig;
}

function addPropertyCustomizer(
  value: any,
  key: string | number | undefined,
  _: any,
  receivedObject: { [key: string]: unknown },
  path: string[],
) {
  const currentKey = path[0];

  if (key === currentKey && hasNestedPaths(path)) {
    path.shift();
  } else if (key === currentKey && isTargetPath(path)) {
    path.shift();
    return {
      ...value,
      controls: sortByOrder({
        ...value['controls'],
        ...receivedObject,
      }),
    };
  }

  return undefined;
}

export function editProperty(
  object: DynamicFormConfig,
  receivedObject: { [key: string]: DynamicControl },
  targetKey: string,
) {
  const path = targetKey.split('.');

  if (isTargetPath(path)) {
    const currentKey = path[0];
    const { [currentKey]: deletedKey, ...rest } = object.controls;
    return {
      ...object,
      controls: sortByOrder({
        ...rest,
        ...receivedObject,
      }),
    };
  }

  return cloneDeepWith(object, (value, key, obj) =>
    editPropertyCustomizer(value, key, obj, receivedObject, path),
  ) as DynamicFormConfig;
}

function editPropertyCustomizer(
  value: any,
  key: string | number | undefined,
  _: any,
  receivedObject: { [key: string]: unknown },
  path: string[],
) {
  const currentKey = path[0];

  if (key === currentKey && hasNestedPaths(path)) {
    path.shift();
  } else if (
    key === 'controls' &&
    value.hasOwnProperty(currentKey) &&
    isTargetPath(path)
  ) {
    const { [currentKey]: deletedKey, ...rest } = value;
    path.shift();
    return sortByOrder({
      ...rest,
      ...receivedObject,
    });
  }

  return undefined;
}

export function deleteProperty(object: DynamicFormConfig, targetKey: string) {
  const path = targetKey.split('.');

  if (isTargetPath(path)) {
    const currentKey = path[0];
    const { [currentKey]: deletedKey, ...rest } = object.controls;
    return {
      ...object,
      controls: rest,
    };
  }

  return cloneDeepWith(object, (value, key, obj) =>
    deletePropertyCustomizer(value, key, obj, path),
  ) as DynamicFormConfig;
}

function deletePropertyCustomizer(
  value: any,
  key: string | number | undefined,
  _: any,
  path: string[],
) {
  const currentKey = path[0];

  if (key === currentKey && hasNestedPaths(path)) {
    path.shift();
  } else if (
    key === 'controls' &&
    value.hasOwnProperty(currentKey) &&
    isTargetPath(path)
  ) {
    const { [currentKey]: deletedKey, ...rest } = value;
    path.shift();
    return rest;
  }

  return undefined;
}
