import { Banner } from "@primer/react";
import DefaultLayout from "interface/DefaultLayout";

export default function ConfirmRegisterPage() {
  return (
    <DefaultLayout
      contentWidth="small"
      metadata={{ title: "Confirm your email!" }}
    >
      <Banner
        variant="warning"
        title="You are almost there!"
        description="We've sent you an email to confirm your account. Please check your inbox."
      />
    </DefaultLayout>
  );
}
