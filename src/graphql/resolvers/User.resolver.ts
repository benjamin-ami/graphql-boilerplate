import { Resolver } from 'type-graphql';
import { User, UserCrudResolver } from '@generated/type-graphql';
import { hashSync } from 'bcryptjs';

@Resolver((of) => User)
export default class HashPassword extends UserCrudResolver {
  constructor() {
    super();
  }

  hashPassword(args) {
    if (Array.isArray(args.data) && args.data.length) {
      args.data.forEach((user) => {
        user.password = hashSync(user.password, +process.env.SALT);
      });
    } else {
      args.data.password = hashSync(args.data.password, +process.env.SALT);
    }
    return args;
  }

  createManyUser(ctx, info, args) {
    args = this.hashPassword(args);
    return super.createManyUser(ctx, info, args);
  }

  createUser(ctx, info, args) {
    args = this.hashPassword(args);
    return super.createUser(ctx, info, args);
  }

  updateUser(ctx, info, args) {
    args = this.hashPassword(args);
    return super.updateUser(ctx, info, args);
  }

  updateManyUser(ctx, info, args) {
    args = this.hashPassword(args);
    return super.updateManyUser(ctx, info, args);
  }
}
