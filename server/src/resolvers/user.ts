
import { validateRegisterInput } from './../utils/validateRegisterInput';
import { UserMutionResponse } from './../types/UserMutionResponse';

import { Arg, Mutation, Resolver } from 'type-graphql';
import argon2 from 'argon2'
import { User } from '../entities/User';
import { RegisterInput } from '../types/RegisterInput';
import { LoginInput } from './../types/LoginInput';


@Resolver()
export class UserResolvers {
    @Mutation(_return => UserMutionResponse, { nullable: true}) 

    async register(
        @Arg('registerInput') registerInput : RegisterInput,
    ): Promise<UserMutionResponse> {
        const validateRegisterInputErrors = validateRegisterInput(registerInput)   
        if (validateRegisterInputErrors){
            return {
                code: 400,
                success: false,
                ...validateRegisterInputErrors
            }
        }
            
        try {
            const {username, email, password} = registerInput
            const existingUser = await User.findOne({
                where: [{username}, {email}]
            }) // SELECT * FROM USER WHERE username=username or email=email
            if (existingUser) 
                return {
                    code: 400,
                    success: false,
                    message: 'Duplicated username or email',
                    errors: [
                        {
                            field: existingUser.username === username ? 'username' : 'email',
                            message: `${existingUser.username === username ? 'username': 'email'} already taken`
                        }
                    ]
                }
            const hashedPassword = await argon2.hash(password)

            const newUser = User.create({
                username,
                email,
                password: hashedPassword
            })
            return {
                code: 200,
                success: true,
                message: 'User register successfully',
                user: await User.save(newUser)   
            }   
        } catch (error) {
            return {
                code: 500,
                message: `Internal server error ${error.message}`,
                success: false    
            }
        }    
    }
  
    @Mutation(_return => UserMutionResponse )
    async login( @Arg('loginInput') loginInput: LoginInput ): Promise<UserMutionResponse>{
        try {
            const {username,password} = loginInput
            const existingUser = await User.findOne({ 
                where: [{username}, {email: username}]
            })

            if (!existingUser) 
                return {
                    code: 400,
                    message: 'User not found',
                    success: false,
                    errors: [{ field: 'username or email', message: 'Not found username or password in system'}]
                }
            
            const passwordValid = await argon2.verify(existingUser.password, password)
            if (!passwordValid) {
                return {
                    code: 400,
                    message: 'Wrong password',
                    success: false,
                    errors: [{ field: 'password', message: 'Wrong password'}]
                }
            }
            
            return {code: 200, success: true, message: 'Login successfully', user: existingUser}    

        } catch (error) {
            return {
                code: 500,
                message: `Internal server error ${error.message}`,
                success: false    
            }
        }
    }
}