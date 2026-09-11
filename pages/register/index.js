import { useState, useEffect } from "react";
import { Button, FormControl, TextInput, Stack, Heading } from "@primer/react";
import DefaultLayout from "../../interface/DefaultLayout";

export default function RegisterPage() {
  return (
    <DefaultLayout
      contentWidth="small"
      metadata={{
        title: "Register",
        description: "Create your account for free",
      }}
    >
      <Stack gap="spacious">
        <Heading as="h1">Register</Heading>
        <RegisterForm />
      </Stack>
    </DefaultLayout>
  );
}

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const requestBody = {
      username,
      email,
      password,
    };

    const response = await fetch("/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.status === 201) {
      location.href = "/register/confirmation";
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="normal">
        <FormControl>
          <FormControl.Label>Email</FormControl.Label>
          <TextInput
            type="text"
            value={email}
            onChange={handleEmailChange}
            block
          />
        </FormControl>
        <FormControl>
          <FormControl.Label>Username</FormControl.Label>
          <TextInput
            type="text"
            value={username}
            onChange={handleUsernameChange}
            block
          />
        </FormControl>
        <FormControl>
          <FormControl.Label>Password</FormControl.Label>
          <TextInput
            type="password"
            value={password}
            onChange={handlePasswordChange}
            block
          />
        </FormControl>
        <Stack.Item>
          <Button type="submit" variant="primary">
            Register
          </Button>
        </Stack.Item>
      </Stack>
    </form>
  );
}
