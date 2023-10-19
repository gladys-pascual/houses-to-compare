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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { trpc } from '@/app/_trpc/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

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
              <strong>{data.factor}</strong> with a weight{' '}
              <strong>{data.weight}</strong> has been added to your criteria ✨
            </>
          ),
        });
        router.refresh();
      },
    });

  const onSubmit = (data: z.infer<typeof CreateCriterionFormSchema>) => {
    return createCriterion({ ...data });
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
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className={`flex ${isCriteriaEmpty ? 'mt-1 ' : 'justify-end'}`}>
        <DialogTrigger className='mb-4' asChild>
          <Button>
            {isCriteriaEmpty ? 'Create your first criteria' : 'Create'}
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create criteria</DialogTitle>
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
                    <FormMessage className='text-xs' />
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
                    <FormLabel>Weight</FormLabel>
                    <FormDescription>
                      {' '}
                      Enter a value between 1 to 10. This will be used as ratio
                      when calculating the total score for a house.
                    </FormDescription>

                    <FormControl>
                      <Input
                        id='weight'
                        type='number'
                        placeholder='9, 10..'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-xs' />
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
  );
}
