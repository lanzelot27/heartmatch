export class CreateProfileDto {
  email: string;
  name?: string;
  bio?: string;
  password: string;
  age: number;
  profileImage?: string;
}
