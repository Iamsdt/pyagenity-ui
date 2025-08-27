import PropTypes from "prop-types"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const LoginUI = ({ form, onSubmit }) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-900 dark:to-slate-800">
      <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-8 w-full max-w-md flex flex-col items-center">
        <div className="mb-6 flex flex-col items-center">
          <img src="/vite.svg" alt="App Logo" className="h-12 w-12 mb-2" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Welcome Back
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Sign in to your account
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-5"
            autoComplete="off"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@email.com"
                      type="email"
                      autoComplete="username"
                      {...field}
                      className="w-full"
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
                      placeholder="••••••••"
                      type="password"
                      autoComplete="current-password"
                      {...field}
                      className="w-full"
                      disabled
                    />
                  </FormControl>
                  <FormDescription>
                    Password field is for design only.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" size="lg">
              Sign In
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-xs text-slate-400 text-center">
          © {new Date().getFullYear()} YourApp. All rights reserved.
        </div>
      </div>
    </div>
  )
}
LoginUI.propTypes = {
  form: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default LoginUI
