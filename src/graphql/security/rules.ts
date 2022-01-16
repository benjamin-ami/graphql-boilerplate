import { rule, shield, and } from 'graphql-shield';

const isAuthenticated = rule({ cache: 'contextual' })(async (parent, args, ctx) => ctx.user !== null);
const isSuperAdmin = rule({ cache: 'contextual'})(async (parent, args, ctx) => ctx.user.role === 'SUPERADMIN');
const isAdmin = rule({ cache: 'contextual'})(async (parent, args, ctx) => ctx.user.role === 'ADMIN');
const isUser = rule({ cache: 'contextual'})(async (parent, args, ctx) => ctx.user.role === 'USER');

const permissions = shield(
  {
    Query: {
      users: and(isAuthenticated, isSuperAdmin),
    },
  },
  {
    allowExternalErrors: true,
  },
);

export default permissions;
