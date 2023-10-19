import { Actor } from 'excalibur';

export const getTiledObjectPropertyValues = (
  actor: Actor,
  propertyNames: string[],
) => {
  const target = actor.getComponents().find((c) => c.type === "ex.tiledobject");

  return propertyNames.map((propertyName) => {
    //   @ts-ignore
    const value = target.object.properties.find((p) => {
      return p.name === propertyName;
    })?.value as string | undefined;

    return null || value;
  });
};
