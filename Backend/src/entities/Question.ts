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

   // unidirectional
   @OneToMany(type => Answer, answer => answer.question)
   choices!: Answer[];   

   // bidirectional
   @ManyToOne(type => Survey, survey => survey.participants)
   survey!: Survey;
}