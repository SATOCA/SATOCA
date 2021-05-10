import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany } from "typeorm";
import { Survey } from "./Survey";
import { Answer } from "./Answer";

@Entity()
export class Question extends BaseEntity {

   @PrimaryGeneratedColumn()
   id: number = 0;

   @Column()
   text: string = "";

   @Column()
   multiResponse: boolean = false;

   @OneToMany(type => Answer, answer => answer.question)
   choices: Answer[];

   @ManyToOne(type => Survey, survey => survey.id)
   survey: Survey;
}