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
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Criterion = {
  factor: string;
  weight: string;
  id: number;
  criteriaId: number | null;
};

type CreateHouseWithScoreProps = {
  criteriaList: Criterion[];
  isEmpty: boolean;
};

export default function CreateHouseWithScore({
  criteriaList,
  isEmpty,
}: CreateHouseWithScoreProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const criteriaScoreSchema = criteriaList?.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.id]: z.coerce
        .number({
          required_error: `Score for ${curr.factor}  is required`,
          invalid_type_error: `Score for ${curr.factor} is required`,
        })
        .positive({ message: 'Score must be between 1 to 10' })
        .max(10, { message: 'Score must be between 1 to 10' }),
    };
  }, {});

  const CreateHouseWithScoreSchema = z.object({
    houseAddress: z.string({
      required_error: 'House name is required',
    }),
    ...criteriaScoreSchema,
  });

  const sortByFactorWeight = (a: Criterion, b: Criterion) => {
    return +b.weight - +a.weight;
  };

  const getScoreRows = () => {
    return criteriaList?.sort(sortByFactorWeight).map((criterion) => {
      const { factor, id } = criterion;
      return (
        <div className='mt-4' key={id}>
          <FormField
            control={form.control}
            //@ts-expect-error: dynamic typing of schema causing ts error
            // todo: fix this
            name={id.toString()}
            render={({ field }) => (
              <FormItem>
                <div className='grid grid-cols-2 items-center gap-4'>
                  <FormLabel className='pl-4 font-normal'>{factor}</FormLabel>
                  <FormControl>
                    <Input
                      id={id.toString()}
                      type='number'
                      placeholder='9, 10..'
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className='text-xs text-end' />
              </FormItem>
            )}
          />
        </div>
      );
    });
  };

  const { mutate: createCriterionScores, isLoading } =
    trpc.createCriterionScores.useMutation({
      onSuccess: (data) => {
        setIsDialogOpen(false);
        toast({
          description: (
            <>
              Congratulations, <strong>{data?.address}</strong> has been rated
              ✨
            </>
          ),
        });
        router.refresh();
      },
    });

  const onSubmit = (data: z.infer<typeof CreateHouseWithScoreSchema>) => {
    const { houseAddress, ...rest } = data;

    const dataToSubmit = {
      criterionScores: Object.entries(rest).map(([key, value]) => {
        return { criterionId: +key, criterionScore: value as number };
      }),
      houseAddress,
    };

    return createCriterionScores(dataToSubmit);
  };

  const form = useForm<z.infer<typeof CreateHouseWithScoreSchema>>({
    resolver: zodResolver(CreateHouseWithScoreSchema),
  });

  React.useEffect(() => {
    if (!isDialogOpen) {
      form.reset();
    }
  }, [form, isDialogOpen]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className={`flex ${isEmpty ? 'mt-1 ' : 'justify-end'}`}>
        <DialogTrigger className='mb-4' asChild>
          <Button>{isEmpty ? 'Rate your first house ' : 'Create'}</Button>
        </DialogTrigger>
      </div>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Rate a house</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='mb-4'>
              <FormField
                control={form.control}
                name='houseAddress'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>House Address</FormLabel>
                    <FormControl>
                      <Input
                        id='houseAddress'
                        placeholder='123 My Dream House...'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-xs' />
                  </FormItem>
                )}
              />
            </div>

            <div className='mb-4'>
              <FormLabel>Rating</FormLabel>
              <FormDescription>
                Enter a rating for each criteria
              </FormDescription>
              {getScoreRows()}
              <FormDescription className='mt-4'>
                You can adjust your predefined criteria{' '}
                <Link
                  href='/criteria'
                  className='text-blue-600 hover:underline'
                >
                  here
                </Link>
                .
              </FormDescription>
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
