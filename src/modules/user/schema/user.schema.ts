import { TypeOf, object, string } from "zod"

export const createUserSchema = object({
    body: object({
        name: string({
            required_error: 'Name is required'
        }),
        email: string({
            required_error: "Email is required"
        }).email("Not a valid email address"),
        password: string({
            required_error: 'Password is required'
        }).min(8, "Password too short")
    })
})

export const verifyEmailSchema = object({
    query: object({
        token: string({
            required_error: "Verification token is required"
        })
    })
})

export const resendVerificationEmailSchema = object({
    body: object({
        email: string({
            required_error: "Email is required"
        }).email("Not a valid email address")
    })
})

export const requestResetPasswordSchema = object({
    body: object({
        email: string({
            required_error: "Email is required"
        }).email("Not a valid email address")
    })
})

export const resetPasswordSchema = object({
    body: object({
        newPassword: string({
            required_error: "Password is required"
        }).min(8, "Password too short"),
        token: string({
            required_error: "Verification token is required"
        })
    })
})

export type CreateUserInput = TypeOf<typeof createUserSchema>;