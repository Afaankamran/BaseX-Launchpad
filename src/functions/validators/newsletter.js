import { object, string } from "yup";

export const newsletterValidator = object({
    email: string().required("Please Enter Email").email("Invalid email address")
})