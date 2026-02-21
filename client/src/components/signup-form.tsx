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
import { useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'
import axios from 'axios'
import { toast } from 'sonner'

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { url, settoken } = useContext(AuthContext)!

  const navigate = useNavigate()

  const formSchema = z
    .object({
      name: z
        .string()
        .min(2, 'Name must be at least 2 characters long')
        .max(50, 'Name must be at most 50 characters long'),
      email: z.email().min(1, 'email is  required'),
      password: z.string().min(4, 'password must be at least 4 characters'),
      confirmPassword: z
        .string()
        .min(4, 'confirm password must be at least 4 characters'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'passwords do not match',
      path: ['confirmPassword'],
    })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post(`${url}/api/auth/signup`, data)
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
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {' '}
            <FieldGroup>
              <Controller
                name='name'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='form-rhf-demo-name'>Name</FieldLabel>
                    <Input
                      {...field}
                      id='form-rhf-demo-name'
                      aria-invalid={fieldState.invalid}
                      placeholder='Enter your name'
                      autoComplete='off'
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
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
              <div className='grid grid-cols-2 gap-4'>
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
                <Controller
                  name='confirmPassword'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='form-rhf-demo-confirm-password'>
                        Confirm Password
                      </FieldLabel>
                      <Input
                        {...field}
                        id='form-rhf-demo-confirm-password'
                        aria-invalid={fieldState.invalid}
                        placeholder='Confirm your password'
                        autoComplete='off'
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
              <Field>
                <Button type='submit'>Create Account</Button>
                <FieldDescription className='text-center'>
                  Already have an account? <Link to='/login'>Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>{' '}
        </CardContent>
      </Card>
    </div>
  )
}
