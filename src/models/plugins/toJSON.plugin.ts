import { Schema, Document } from 'mongoose';

const deleteAtPath = (obj: any, path: string[], index: number): void => {
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  if (obj[path[index]]) {
    deleteAtPath(obj[path[index]], path, index + 1);
  }
};

const toJSON = (schema: Schema): Record<string, any> => {
  const jsonSchema: Record<string, any> = {};

  // Iterate over schema paths
  for (const path in schema.paths) {
    const pathType = schema.paths[path].instance;
    jsonSchema[path] = {
      type: pathType,
      required: schema.paths[path].isRequired,
      private: schema.paths[path].options?.private || false,
      // Add any other properties you want to include
    };
  }

  // Include virtuals if any
  if (schema.virtuals) {
    jsonSchema.virtuals = Object.keys(schema.virtuals).map((virtualName) => ({
      name: virtualName,
      //@ts-ignore
      type: schema.virtuals[virtualName].instance,
    }));
  }

  return jsonSchema;
};

export default toJSON;
