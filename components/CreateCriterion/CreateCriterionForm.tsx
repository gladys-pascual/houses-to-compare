'use client';

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
import { WeightIconInfo } from '../WeightInfoIcon';
import { trpc } from '@/app/_trpc/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const CreateCriterionFormSchema = z.object({
  factor: z.string({
    required_error: 'Factor is required',
  }),
  weight: z.coerce
    .number({
      required_error: 'Weight is required',
      invalid_type_error: 'Weight is required',
    })
    .positive({ message: 'Weight must be between 1 to 10' })
    .max(10, { message: 'Weight must be between 1 to 10' }),
});

export default function CreateCriterionForm() {
  const userId = 1;
  const { mutate: createCriterion } = trpc.createCriterion.useMutation({
    onSuccess: () => {
      trpc.getCriteria.useQuery();
    },
  });

  // const { data: criteria } = trpc.getCriteria.useQuery();

  const onSubmit = (data: z.infer<typeof CreateCriterionFormSchema>) => {
    return createCriterion({ ...data, userId });
  };

  const form = useForm<z.infer<typeof CreateCriterionFormSchema>>({
    resolver: zodResolver(CreateCriterionFormSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='mb-4'>
          <FormField
            control={form.control}
            name='factor'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Factor</FormLabel>
                <FormControl>
                  <Input
                    id='factor'
                    placeholder='location, garden size..'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='mb-4'>
          <FormField
            control={form.control}
            name='weight'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-center'>
                  <FormLabel>Weight</FormLabel>
                  <WeightIconInfo />
                </div>
                <FormControl>
                  <Input
                    id='weight'
                    type='number'
                    placeholder='9, 10..'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex justify-end'>
          <Button type='submit'>Create</Button>
        </div>
      </form>
    </Form>
  );
}
