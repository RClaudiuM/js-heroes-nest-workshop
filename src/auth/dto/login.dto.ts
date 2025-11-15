import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'test@example.com', type: "string" })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password' })
    @IsString()
    password: string;
}
