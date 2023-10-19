const prefix = '../assets/maps/';
// "../assets/maps/map1/tilemap.tmx"
export const paths = [
  // @index('./**/*.tmx', (f,_) => `'${f.path.replace(/.\//, '')}',`)
  'village/roderikHouse/basement',
  'village/roderikHouse/house',
  'village/villageCenter',
  // @endindex
];

export enum EMapsEnum {
  // @index('./**/*.tmx', (f,_) => `"${_.pascalCase(f.path.replace(/.\//, ' ').replace(/\//, ' '))}"= "${_.pascalCase(f.path.replace(/.\//, ' ').replace(/\//, ' '))}",`)
  'VillageRoderikHouseBasement' = 'VillageRoderikHouseBasement',
  'VillageRoderikHouseHouse' = 'VillageRoderikHouseHouse',
  'VillageVillageCenter' = 'VillageVillageCenter',
  // @endindex
}
export const pathsPlainObject = {
  // @index('./**/*.tmx', (f,_) => `${_.pascalCase(f.path.replace(/.\//, ' ').replace(/\//, ' '))}: prefix + '${f.path.replace(/.\//, '')}'+".tmx",`)
  VillageRoderikHouseBasement:
    prefix + 'village/roderikHouse/basement' + '.tmx',
  VillageRoderikHouseHouse: prefix + 'village/roderikHouse/house' + '.tmx',
  VillageVillageCenter: prefix + 'village/villageCenter' + '.tmx',
  // @endindex
} as const;

export const pathsNullValues = {
  // @index('./**/*.tmx', (f,_) => `${_.pascalCase(f.path.replace(/.\//, ' ').replace(/\//, ' '))}: null,`)
  VillageRoderikHouseBasement: null,
  VillageRoderikHouseHouse: null,
  VillageVillageCenter: null,
  // @endindex
} as const;

export const fullPaths = paths.map((path) => prefix + path + '.tmx');

export type TMapNames = keyof typeof pathsPlainObject;
export const pathsObject = paths.reduce((acc, path) => {
  const splitted = path.split('/') as TMapNames[];
  const filename = splitted.pop();

  let current = acc;

  for (const folder of splitted) {
    if (!current[folder]) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      current[folder] = {};
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    current = current[folder];
  }

  if (!filename) throw new Error('filename is undefined');
  current[filename] = prefix + path;

  return acc;
}, {} as Record<TMapNames, string>);
