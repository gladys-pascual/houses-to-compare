'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
// import CreateCriterionForm from './CreateCriterionForm';
import { Input } from '@/components/ui/input';
import { WeightIconInfo } from './WeightInfoIcon';
import { trpc } from '@/app/_trpc/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

// hard coded for now
const userId = 1;

type CreateCriteriaProps = {
  isCriteriaEmpty: boolean;
};

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

export default function CreateCriterion({
  isCriteriaEmpty,
}: CreateCriteriaProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const { mutate: createCriterion, isLoading } =
    trpc.createCriterion.useMutation({
      onSuccess: (data) => {
        setIsDialogOpen(false);
        toast({
          description: (
            <>
              Factor <strong>{data.factor}</strong> with weight{' '}
              <strong>{data.weight}</strong> has been added to your criteria
            </>
          ),
        });
        router.refresh();
      },
    });

  const onSubmit = (data: z.infer<typeof CreateCriterionFormSchema>) => {
    return createCriterion({ ...data, userId });
  };

  const form = useForm<z.infer<typeof CreateCriterionFormSchema>>({
    resolver: zodResolver(CreateCriterionFormSchema),
  });

  React.useEffect(() => {
    if (!isDialogOpen) {
      form.reset();
    }
  }, [form, isDialogOpen]);

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className={`flex ${isCriteriaEmpty ? 'mt-1 ' : 'justify-end'}`}>
          <DialogTrigger className='mb-4' asChild>
            <Button>{isCriteriaEmpty ? 'Create a criteria' : 'Create'}</Button>
          </DialogTrigger>
        </div>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Create a criteria</DialogTitle>
            {/* <DialogDescription>description</DialogDescription> */}
          </DialogHeader>
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
              <DialogFooter>
                <DialogClose asChild>
                  <Button type='button' variant='secondary'>
                    Close
                  </Button>
                </DialogClose>
                {isLoading ? (
                  <Button disabled>
                    <RefreshCw className='animate-spin' />
                  </Button>
                ) : (
                  <Button type='submit'>Create</Button>
                )}
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
