import * as _ from 'lodash';
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

    const userData = _.pick(user, [
      'id',
      'phoneNumber',
      'email',
      'fullName',
      'date_of_birth',
      'createdAt',
      'gender'
    ]);
    return {
      ...userData,
      highestRole
    };
  }
}
