"use client";

import { Button, TextField, toast } from "@events-lab/shared-components";
import { useState, type FormEvent } from "react";

export function WorkspaceForm() {
  const [name, setName] = useState("Events Lab");
  const [email, setEmail] = useState("ops@eventslab.test");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast({ title: "Settings saved", description: name });
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <TextField
        label="Workspace name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <TextField
        label="Support email"
        type="email"
        value={email}
        hint="Staff replies go to this address."
        onChange={(event) => setEmail(event.target.value)}
      />
      <Button type="submit">Save settings</Button>
    </form>
  );
}
