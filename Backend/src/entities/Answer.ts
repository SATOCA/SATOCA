import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm";
import { Question } from './Question'

@Entity({ name: 'answer' })
export class Answer extends BaseEntity {

   @PrimaryGeneratedColumn()
   id: number = 0;

   @Column()
   text: string = "";

   @ManyToOne(type => Question, question => question.choices)
   question!: Question;
}