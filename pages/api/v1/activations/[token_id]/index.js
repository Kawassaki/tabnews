import { createRouter } from "next-connect";
import controller from "infra/contoller.js";
import activation from "models/activation.js";
import authorization from "models/authorization.js";

export default createRouter()
  .use(controller.injectAnonymousOrUser)
  .patch(controller.canRequest("read:activation_token"), patchHandler)
  .handler(controller.errorHandlers);

async function patchHandler(request, response) {
  const activationTokenId = request.query.token_id;
  const userTryingToActivate = request.context.user;
  const validActivationToken =
    await activation.findOneValidById(activationTokenId);

  if (validActivationToken.used_at) {
    const secureOutputValues = authorization.filterOutput(
      userTryingToActivate,
      "read:activation_token",
      validActivationToken,
    );
    return response.status(200).json(secureOutputValues);
  }

  await activation.activateUserByUserId(validActivationToken.user_id);

  const usedActivationToken =
    await activation.markTokenAsUsed(activationTokenId);

  const secureOutputValues = authorization.filterOutput(
    userTryingToActivate,
    "read:activation_token",
    usedActivationToken,
  );

  return response.status(200).json(secureOutputValues);
}
