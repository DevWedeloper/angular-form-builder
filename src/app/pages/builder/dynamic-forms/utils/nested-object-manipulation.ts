type StackElement = {
  src: { [key: string]: any };
  dest: { [key: string]: any };
};

function isObjectNotNull(value: unknown): boolean {
  return typeof value === 'object' && value !== null;
}

function objectHasPropertyControls(object: {
  [key: string]: unknown;
}): boolean {
  return isObjectNotNull(object) && object.hasOwnProperty('controls');
}

function isControls(object: string): boolean {
  return object === 'controls';
}

function hasNestedPaths(path: unknown[]): boolean {
  return path.length > 1;
}

function isNotNested(path: unknown[]): boolean {
  return path.length === 0;
}

function isTargetPath(path: unknown[]): boolean {
  return path.length === 1;
}

function initializeStack(
  object: { [key: string]: any },
  clone: { [key: string]: any },
): StackElement[] {
  return [{ src: object, dest: clone }];
}

function pushNestedObjects(
  stack: StackElement[],
  key: string,
  value: any,
  dest: { [key: string]: any },
): void {
  if (isObjectNotNull(value)) {
    const newClone = Array.isArray(value) ? [] : {};
    dest[key] = newClone; // Add newClone to dest, which modifies clone
    stack.push({ src: value, dest: newClone }); // Push the nested objects onto the stack
  } else {
    dest[key] = value; // Directly assign primitive values to dest, which modifies clone
  }
}

function createCloneAndStack(object: { [key: string]: any }): {
  clone: { [key: string]: any };
  stack: StackElement[];
} {
  // Create a new empty object or array based on the type of 'object'
  const clone: { [key: string]: any } = Array.isArray(object) ? [] : {};

  // Initialize stack with the initial source (object) and destination (clone)
  const stack: StackElement[] = initializeStack(object, clone);
  return { clone, stack };
}

function mergeAndReplace(
  sourceObject: { [key: string]: unknown },
  receivedObject: { [key: string]: unknown },
  targetKey: string,
): { [key: string]: unknown } {
  // Reconstruct the controls object with the target key replaced
  const { [targetKey]: _, ...rest } = sourceObject;
  return {
    ...rest,
    ...receivedObject,
  };
}

function sortByOrder(obj: { [key: string]: { order: number } }) {
  // Get the object keys
  const keys = Object.keys(obj);

  // Sort the keys based on the 'order' property within each item
  const sortedKeys = keys.sort(
    (key1, key2) => obj[key1].order - obj[key2].order,
  );

  // Create a new object with the sorted order using spread syntax
  return sortedKeys.reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});
}

export function addProperty(
  object: { [key: string]: unknown },
  receivedObject: { [key: string]: unknown },
  targetKey: string | null,
) {
  const { clone, stack } = createCloneAndStack(object);
  const path = targetKey === '' ? [] : targetKey?.split('.') || [];

  // Flag to indicate if path is not nested
  let isNotNestedFlag = false;

  // Process each element in the stack until it's empty
  while (stack.length > 0) {
    // Pop an element from the stack
    const { src, dest } = stack.pop()!;

    // Iterate over the entries of the current source object
    for (const [key, value] of Object.entries(src)) {
      pushNestedObjects(stack, key, value, dest);
    }

    const currentKey = path[0];
    const currentObject = src[currentKey];

    if (isObjectNotNull(currentObject) && hasNestedPaths(path)) {
      path.shift();
    }
    // If currentKey matches the current key and has a 'controls' property, merge the receivedObject into 'controls
    else if (isObjectNotNull(currentObject) && isTargetPath(path)) {
      if (objectHasPropertyControls(currentObject)) {
        dest[currentKey] = {
          ...currentObject,
          controls: sortByOrder({
            ...currentObject.controls,
            ...receivedObject,
          }),
        };
      }
    } else if (
      isObjectNotNull(src) &&
      isNotNested(path) &&
      isNotNestedFlag === false
    ) {
      if (objectHasPropertyControls(src)) {
        dest['controls'] = sortByOrder({
          ...src['controls'],
          ...receivedObject,
        });
      }
      isNotNestedFlag = true;
    }
  }

  // Return the modified clone
  return clone;
}

export function deleteProperty(
  object: { [key: string]: unknown },
  targetKey: string,
) {
  const { clone, stack } = createCloneAndStack(object);
  const path = targetKey.split('.');

  // Process each element in the stack until it's empty
  while (stack.length > 0) {
    // Pop an element from the stack
    const { src, dest } = stack.pop()!;

    // Iterate over the entries of the current source object
    for (const [key, value] of Object.entries(src)) {
      pushNestedObjects(stack, key, value, dest);
    }

    const currentKey = path[0];
    const currentObject = src[currentKey];

    if (isObjectNotNull(currentObject) && hasNestedPaths(path)) {
      path.shift();
    } else if (isObjectNotNull(currentObject) && isTargetPath(path)) {
      delete dest[currentKey];
      // Remove last entry to avoid deleting an inner object with the same key
      path.shift();
    }
  }

  // Return the modified clone
  return clone;
}

export function editProperty(
  object: { [key: string]: unknown },
  receivedObject: { [key: string]: unknown },
  targetKey: string,
) {
  const { clone, stack } = createCloneAndStack(object);
  const path = targetKey.split('.');

  // Flag to indicate if path is not nested
  let isNotNestedFlag = false;

  // Process each element in the stack until it's empty
  while (stack.length > 0) {
    // Pop an element from the stack
    let { src, dest } = stack.pop()!;

    // Iterate over the entries of the current source object
    for (const [key, value] of Object.entries(src)) {
      pushNestedObjects(stack, key, value, dest);
    }

    const parentPath = [...path];
    parentPath.pop();

    const parentKey = parentPath[0];
    const targetSubKey = path[path.length - 1];
    const currentObject = src[parentKey];

    if (isObjectNotNull(currentObject) && hasNestedPaths(parentPath)) {
      path.shift();
    } else if (isObjectNotNull(currentObject) && isTargetPath(parentPath)) {
      // If the key is the parentKey, reconstruct it with the modified controls object
      const newParent: { [key: string]: unknown } = {};
      for (const [subKey, subValue] of Object.entries(currentObject)) {
        if (isControls(subKey) && isObjectNotNull(subValue)) {
          newParent[subKey] = sortByOrder(
            mergeAndReplace(
              subValue as { [key: string]: unknown },
              receivedObject,
              targetSubKey,
            ) as { [key: string]: { order: number } },
          );
        } else {
          newParent[subKey] = subValue;
        }
      }

      // Assign the reconstructed parent object to the destination
      dest[parentKey] = newParent;
    } else if (
      isObjectNotNull(src) &&
      isNotNested(parentPath) &&
      isNotNestedFlag === false
    ) {
      if (objectHasPropertyControls(src)) {
        dest['controls'] = sortByOrder(
          mergeAndReplace(src['controls'], receivedObject, targetSubKey) as {
            [key: string]: { order: number };
          },
        );
      }
      isNotNestedFlag = true;
    }
  }

  // Return the modified clone
  return clone;
}
