import * as _ from 'lodash';
import { User } from '../entities/user.entity';
import { UserRole } from '../enums/user-roles.enum';

export class UserView {
  constructor(private readonly data: User | User[]) {}

  render() {
    if (Array.isArray(this.data)) {
      return this.data.map((user) => this.renderUser(user));
    }
    return this.renderUser(this.data);
  }

  renderUser(user: User) {
    if (!user) return;

    const rolePriority: UserRole[] = [
      UserRole.ADMIN,
      UserRole.TEACHER,
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
