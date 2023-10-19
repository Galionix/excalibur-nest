import { ImageFiltering, ImageSource, Loader } from 'excalibur';

import { TiledMapResource } from '@excaliburjs/plugin-tiled';
import { pathsPlainObject } from '../assets/maps/maps';

// collect maps from folders

const maps = Object.entries(pathsPlainObject).reduce((acc, [key, value]) => {
  const resource = new TiledMapResource(value);

  resource.convertPath = function (originPath, relativePath) {
    // convert images for tileset paths
    if (relativePath.includes('tileset.')) {
      const filename = relativePath.split('/').pop();
      return './assets/img/' + filename;
    }
    // convert tsj path
    if (relativePath.includes('.tsj')) {
      const filename = relativePath.split('/').pop();
      return './assets/maps/' + filename;
    }

    return relativePath;
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  acc[key] = resource;

  return acc;
}, {} as Record<keyof typeof pathsPlainObject, TiledMapResource>);

/**
 * Default global resource dictionary. This gets loaded immediately
 * and holds available assets for the game.
 */
export const Resources = {
  Sword: new ImageSource(
    '../assets/img/sword.png',
    false,
    ImageFiltering.Pixel
  ),
  chest: new ImageSource(
    '../assets/img/chest2.png',
    false,
    ImageFiltering.Pixel
  ),
  // Map: maps.VillageRoderikHouseBasement,
  // Map: new TiledMapResource("../assets/maps/map1/tilemap.tmx"),
  ...maps,
  // const tiledMapResource = new tiled.TiledMapResource(residenceMap);
  //   scene1Map: new tiled.TiledMapResource(residenceMap),
};

export const loader = new Loader();
for (const resource of Object.values(Resources)) {
  loader.addResource(resource);
}
