import { Field, InterfaceType } from "type-graphql";


@InterfaceType()
export abstract class IMutionResponse {
    @Field()
    code: number
    
    @Field()
    success: boolean

    @Field({nullable: true}) // or NULL
    message?: string
}