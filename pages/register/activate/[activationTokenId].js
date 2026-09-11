import { Banner } from "@primer/react";
import DefaultLayout from "interface/DefaultLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ConfirmRegisterPage() {
  const router = useRouter();
  const { activationTokenId } = router.query;
  const [activationStatus, setActivationStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!activationTokenId) {
      return;
    }

    sendActivationRequest();

    async function sendActivationRequest() {
      try {
        const response = await fetch(
          `/api/v1/activations/${activationTokenId}`,
          {
            method: "PATCH",
          },
        );
        const responseBody = await response.json();
        if (response.status === 200) {
          setActivationStatus("success");
          return;
        }
        setErrorMessage(`${responseBody.message} ${responseBody.action}`);
        setActivationStatus("failure");
      } catch {
        setErrorMessage(
          "Failed to connect to the server. Please try again later.",
        );
        setActivationStatus("failure");
      }
    }
  }, [activationTokenId]);

  return (
    <DefaultLayout
      contentWidth="small"
      metadata={{ title: "Activate account" }}
    >
      {activationStatus === "loading" && (
        <Banner variant="info">
          <Banner.Title>Checking token...</Banner.Title>
        </Banner>
      )}
      {activationStatus === "success" && (
        <Banner variant="success">
          <Banner.Title>Congratulations!</Banner.Title>
          <Banner.Description>
            Your account has been activated and you can now{" "}
            <a href="/login">login.</a>
          </Banner.Description>
        </Banner>
      )}
      {activationStatus === "failure" && (
        <Banner variant="critical">
          <Banner.Title>Failed to activate account</Banner.Title>
          <Banner.Description>{errorMessage}</Banner.Description>
        </Banner>
      )}
    </DefaultLayout>
  );
}
