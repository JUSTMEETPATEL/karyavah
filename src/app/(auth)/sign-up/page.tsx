'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signUpFormSchema } from '@/lib/auth-schema';
import { authClient } from '@/lib/auth-client';
import { toast } from '@/hooks/use-toast';

const SignUp = () => {
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof signUpFormSchema>) {
    const { name, email, password } = values;
    const { data, error } = await authClient.signUp.email(
      {
        email,
        password,
        name,
        callbackURL: '/sign-in',
      },
      {
        onRequest: () => {
          toast({
            title: 'Please Wait...',
          });
        },
        onSuccess: () => {
          form.reset();
          window.location.href = '/sign-in';
        },
        onError: ctx => {
          alert(ctx.error.message);
        },
      }
    );
    console.log(data);
    if (error) {
      throw new Error(error.message);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto transition-all duration-300 hover:shadow-[0_0_15px_rgba(93,63,211,0.5)]">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Welcome! Please Sign Up to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your Name"
                      {...field}
                      className="transition-all duration-300 hover:border-[#5D3FD3] hover:shadow-[0_0_10px_rgba(93,63,211,0.3)]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="test@test.com"
                      {...field}
                      className="transition-all duration-300 hover:border-[#5D3FD3] hover:shadow-[0_0_10px_rgba(93,63,211,0.3)]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      className="transition-all duration-300 hover:border-[#5D3FD3] hover:shadow-[0_0_10px_rgba(93,63,211,0.3)]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full transition-all duration-300 hover:bg-[#5D3FD3] hover:shadow-lg"
              type="submit"
            >
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignUp;