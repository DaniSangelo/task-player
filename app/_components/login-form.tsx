"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "./ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Controller, useForm } from "react-hook-form";
import {
  formAuthLoginSchema,
  FormAuthLoginSchema,
} from "../_actions/auth/login/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import PasswordInput from "./password-input";

const LoginForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormAuthLoginSchema>({
    resolver: zodResolver(formAuthLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: FormAuthLoginSchema) => {
    try {
      const result = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (!result || result.error) {
        throw new Error(result?.error);
      }
    } catch (error) {
      console.log(error);
      form.setError("root", {
        message: "Email or password is incorrect",
      });
      return;
    }

    router.push("/home");
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-6 shadow-sm">
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="form-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="form-email"
                      placeholder="m@example.com"
                      aria-invalid={fieldState.invalid}
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
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      {/* <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a> */}
                    </div>
                    <PasswordInput {...field} id="password" />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                {form.formState.errors.root && (
                  <FieldError errors={[form.formState.errors.root]} />
                )}
                <Button type="submit" className="rounded-full">
                  Login
                </Button>
                {/* <Button
                  variant="outline"
                  type="button"
                  className="rounded-full"
                >
                  Login with Google
                </Button> */}
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link className="text-secondary-600" href="/sign-up">
                    Sign up
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default LoginForm;
