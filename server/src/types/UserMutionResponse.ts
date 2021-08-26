import { User } from "../entities/User";
import { Field, ObjectType } from "type-graphql";
import { IMutionResponse } from "./MutionResponse";
import { FieldError } from "./FieldError";



@ObjectType({implements: IMutionResponse})
export class UserMutionResponse implements IMutionResponse {
   code: number
   success: boolean
   message?: string

   @Field({nullable: true})
   user?: User 

   @Field(_type => [FieldError], {nullable: true})
   errors?: FieldError[] 
}