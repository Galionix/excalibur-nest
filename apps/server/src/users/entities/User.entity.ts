import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uid: string;

  @Column({
    type: "simple-json",
    default: [],
  })
  inventory: {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    // image: string;
  }[];

  @Column("simple-json")
  player: {
    experience: number;
    name: string;
    character: string;
    level: number;
    hp: number;
    mana: number;
  };
  @Column({
    type: "simple-json",
    default: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
    },
  })
  stats: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };

  @Column({
    type: "simple-json",
    default: {
      x: 0,
      y: 0,
      map: "VillageRoderikHouseBasement",
      entry: "1",
    },
  })
  location: {
    x: number;
    y: number;
    map: string;
    entry: string;
  };
}
