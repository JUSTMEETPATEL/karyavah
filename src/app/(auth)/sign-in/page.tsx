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
import { signInFormSchema } from '@/lib/auth-schema';
import { authClient } from '@/lib/auth-client';
import { toast } from '@/hooks/use-toast';

const SignIn = () => {
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof signInFormSchema>) {
    const { email, password } = values;
    const { data, error } = await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: '/dashboard',
      },
      {
        onRequest: () => {
          toast({
            title: 'Please Wait...',
          });
        },
        onSuccess: () => {
          window.location.href = '/dashboard';
        },
        onError: async ctx => {
          if (ctx.error.status === 403) {
            await authClient.sendVerificationEmail({
              email,
              callbackURL: '/dashboard',
            });
            toast({
              title: 'Please verify your email',
              description: 'Email verification has been sent, kindly verify',
            });
          }
          toast({
            title: 'Error',
            description: ctx.error.message,
          });
        },
      }
    );
    console.log(data);
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
      });
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto transition-all duration-300 hover:shadow-[0_0_15px_rgba(93,63,211,0.5)]">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Welcome Back! Please Sign In to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <p className="text-sm text-muted-foreground">
              Forgot Password?{' '}
              <Link
                href="/forgot-password"
                className="text-primary hover:underline"
              >
                Reset Password
              </Link>
            </p>
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
          Don&apos;t Have an Account?{' '}
          <Link href="/sign-up" className="text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignIn;