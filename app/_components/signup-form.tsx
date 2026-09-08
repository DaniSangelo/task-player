"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./ui/field";
import { Input } from "./ui/input";
import { Controller, useForm } from "react-hook-form";
import { formSignupSchema, FormSignupSchema } from "../_actions/sign-up/schema";
import { signupUser } from "../_actions/sign-up";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<FormSignupSchema>({
    resolver: zodResolver(formSignupSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit =  (data: FormSignupSchema) => {
    startTransition(async () => {
      try {
        await signupUser(data);
        router.push("/auth/login");
        router.refresh();
      } catch {
        form.setError("root", {
          message: "Unable to create your account. Please try again.",
        });
      }
    })
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="first_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="form-first_name">First Name</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    {...field}
                    id="form-first_name"
                    type="text"
                    placeholder="John"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="last_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="form-last_name">Last Name</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    {...field}
                    id="form-last_name"
                    type="text"
                    placeholder="Doe"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="form-email">Email</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    id="form-email"
                    type="email"
                    placeholder="m@example.com"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="form-password">Password</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    id="form-password"
                    type="password"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="confirm_password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="form-confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    id="form-confirm-password"
                    type="password"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <FieldGroup>
              <Field>
                {form.formState.errors.root && (
                  <FieldError errors={[form.formState.errors.root]} />
                )}
                <Button className="rounded-full" type="submit" disabled={isPending}>
                  Create Account
                </Button>
                {/* <Button className="rounded-full" variant="outline" type="button">
                  Sign up with Google
                </Button> */}
                <FieldDescription className="px-6 text-center">
                  Already have an account?{" "}
                  <Link className="text-secondary-600" href="/auth/login">
                    Sign in
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
