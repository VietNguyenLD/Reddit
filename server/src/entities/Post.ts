import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title!: string

    @Column()
    text!: string

    @CreateDateColumn()
    createAt: Date

    @CreateDateColumn()
    updatedAt: Date

}