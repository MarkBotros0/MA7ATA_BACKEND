import { User } from '../entities/user.entity';
import { UserRole } from '../enums/user-roles.enum';

export class UserView {
  constructor(private readonly data: User | User[]) {}

  render(): any {
    if (Array.isArray(this.data)) {
      return this.data.map((user) => this.renderUser(user));
    }
    return this.renderUser(this.data);
  }

  private renderUser(user: User): any {
    if (!user) return;

    const rolePriority: UserRole[] = [
      UserRole.ADMIN,
      UserRole.INSTRUCTOR,
      UserRole.NORMAL
    ];

    const highestRole: UserRole = rolePriority.find((role) =>
      user.userRoles.includes(role)
    );

    const userData: Partial<User> = {
      id: user.id,
      phoneNumber: user.phoneNumber,
      email: user.email,
      fullname: user.fullname,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      createdAt: user.createdAt
    };

    return {
      ...userData,
      highestRole
    };
  }
}
