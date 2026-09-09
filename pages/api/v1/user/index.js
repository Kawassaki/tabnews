import { createRouter } from "next-connect";
import controller from "infra/contoller.js";
import session from "models/session.js";
import user from "models/user.js";
import authorization from "models/authorization.js";

const router = createRouter();

router.use(controller.injectAnonymousOrUser);
router.get(controller.canRequest("read:session"), getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const sessionToken = request.cookies.session_id;

  const sessionObject = await session.findOneValidByToken(sessionToken);
  const renewedSessionObject = await session.renew(sessionObject.id);
  const userFound = await user.findOneById(sessionObject.user_id);

  controller.setSessionCookie(renewedSessionObject.token, response);

  response.setHeader(
    "Cache-Control",
    "no-store, no-cache, max-age=0, must-revalidate",
  );
  const secureOutputValues = authorization.filterOutput(
    request.context.user,
    "read:user:self",
    userFound,
  );

  return response.status(200).json(secureOutputValues);
}
