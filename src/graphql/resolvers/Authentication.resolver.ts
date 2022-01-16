import * as bcrypt from 'bcryptjs';
import { Arg, Mutation, Resolver, Ctx } from 'type-graphql';
import * as inputs from '../inputs/Authentication.input';
import * as outputs from '../responses/Authentication.response';
import { AppContext } from '../interfaces';
import { createToken } from '../../utils/jwt';

@Resolver()
export default class AuthenticationResolver {
  @Mutation(() => outputs.UserOutput)
  async login(@Arg('data') data: inputs.LoginInput, @Ctx() ctx: AppContext) {
    const err = new Error('`username` or `password` is incorrect!');
    const user = await ctx.prisma.user.findFirst({
      where: {
        username: data.username,
      },
    });
    if (!user) throw err;

    const validPassword = await bcrypt.compare(data.password, user?.password);
    
    if (!validPassword) throw err;

    const token = await createToken(user);

    return {
      token,
      ...user,
    };
  }
}
