import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    OneToOne,
    JoinColumn, ManyToOne,
} from "typeorm";
import {Survey} from "./Survey";
import {Question} from "./Question";
import {Participant} from "./Participant";

@Entity()
export class TimeTracker extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number = 0;

    @Column()
    start: Date;

    @Column()
    stop: Date;

    @ManyToOne((type) => Survey, survey => survey.timeTrackers)
    survey: Survey;

    @ManyToOne((type) => Question,question => question.timeTrackers)
    question: Question;

    @ManyToOne((type) => Participant,participant => participant.timeTrackers)
    participant: Participant;
}
