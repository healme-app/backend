import { createUserDto } from "./user";

export const loginDto = createUserDto.pick({ email: true, password: true })