import { UserEntity } from 'src/shared/user/user.entity';

export class UserViewResponse {
  public static from(user: UserEntity): UserViewResponse {
    return new UserViewResponse(
      user.id,
      user.fullname,
      user.email,
      user.phone,
      user.username,

      // OPTIONAL FILED
      user.role,
    );
  }

  constructor(
    public readonly id: string,
    public readonly fullname: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly username: string,

    // OPTIONAL FILED
    public readonly role?: string,
  ) {}
}
