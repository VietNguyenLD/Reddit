import { RegisterInput } from "src/types/RegisterInput";


export const validateRegisterInput = (registerInput :RegisterInput) => {
    const {username, email, password} = registerInput
 
    if(!email.includes('@')) {
        return {
            message: 'Invalid email',
            errors: [{ field: 'email', message: 'Email must include @ symbol'}]
        }
    }
    if (password.length < 6) {
        return {
            message: 'Invalid password',
            errors: [{ field: 'password', message: 'Length must be greater than 2'}]
        }
    }

    if (username.length < 2) {
        return {
            message: 'Invalid username',
            errors: [{ field: 'username', message: 'Length must be greater than 2'}]
        }
    }

    return null
}