import { authMiddleware } from '"'"'@clerk/nextjs'"'"';

export default authMiddleware({
  publicRoutes: ['"'"'/'"'"', '"'"'/sign-in'"'"', '"'"'/sign-up'"'"', '"'"'/api/webhooks/(.*)'"'"'],
  ignoredRoutes: ['"'"'/api/webhooks/(.*)'"'"'],
  apiRoutes: ['"'"'/api/(.*)'"'"'],
});

export const config = {
  matcher: [
    '"'"'/((?!.+\\.[\\w]+$|_next).*)'\'',
    '"'"'/'"'"',
    '"'"'/(api|trpc)(.*)'"'"',
  ],
};
