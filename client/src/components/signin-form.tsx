import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '@/context/AuthContext'
import { useContext } from 'react'
import axios from 'axios'
import { toast } from 'sonner'

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { url, settoken } = useContext(AuthContext)!
  const navigate = useNavigate()

  const formSchema = z.object({
    email: z.email().min(1, 'email is  required'),
    password: z.string().min(4, 'password must be at least 4 characters'),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'max@gmail.com',
      password: '123456',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post(`${url}/api/auth/login`, data)
      if (!response.data.success) {
        toast.warning(response.data.message)
        return
      }
      settoken(response.data.token)
      localStorage.setItem('token', response.data.token)
      toast.success(response.data.message)
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {' '}
            <FieldGroup>
              <Controller
                name='email'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='form-rhf-demo-email'>Email</FieldLabel>
                    <Input
                      {...field}
                      id='form-rhf-demo-email'
                      aria-invalid={fieldState.invalid}
                      placeholder='Enter your email'
                      autoComplete='off'
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name='password'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='form-rhf-demo-password'>
                      Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id='form-rhf-demo-password'
                      aria-invalid={fieldState.invalid}
                      placeholder='Enter your password'
                      autoComplete='off'
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />{' '}
              <Field>
                <Button type='submit'>Login</Button>
                <FieldDescription className='text-center'>
                  Don&apos;t have an account? <Link to='/signup'>Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>{' '}
        </CardContent>
      </Card>
    </div>
  )
}
