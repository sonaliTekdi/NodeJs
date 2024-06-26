import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Courses {
  @PrimaryGeneratedColumn()
  id: Number = new Number();

  @Column()
  title: string = "";

  @Column()
  status: string = "";

  @Column()
  is_deleted: boolean = false;
}
