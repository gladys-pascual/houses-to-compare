'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Pen } from 'lucide-react';
import { Trash2Icon } from 'lucide-react';
import { Criterion, CriterionScore } from '@prisma/client';
import { trpc } from '@/app/_trpc/client';
import { Skeleton } from '@/components/ui/skeleton';

type HouseScore = {
  house: {
    link: string | null;
    address: string;
    id: number;
  };
  scoreDetails: {
    factor: string;
    weight: string;
    criterionId: number;
    criterionScore: number;
  }[];
  score: number;
};

type HouseTableProps = {
  housesScore: HouseScore[];
};

export default function HousesTable({ housesScore }: HouseTableProps) {
  const EditHouse = () => {
    return (
      <Dialog>
        <div className='flex justify-end'>
          <DialogTrigger asChild>
            <Button
              className='mr-2'
              variant='outline'
              size='icon'
              aria-label='edit criteria'
            >
              <Pen className='h-4 w-4' />
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Edit your score for xxx</DialogTitle>
            {/* <DialogDescription>description</DialogDescription> */}
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid  items-center gap-4'>
              <Label htmlFor='factor'>Factor</Label>
              <Input
                id='factor'
                // value={criterion.factor}
                className='col-span-3'
              />
            </div>
            <div className='grid  items-center gap-4'>
              <div className='flex items-center'>
                <Label htmlFor='weight' className='pr-1'>
                  Weight
                </Label>
              </div>
              <Input
                id='weight'
                // value={criterion.weight.toString()}
                className='col-span-3'
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type='button' variant='secondary'>
                Close
              </Button>
            </DialogClose>
            <Button type='submit'>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const DeleteHouse = ({ houseScore }: { houseScore: HouseScore }) => {
    return (
      <AlertDialog>
        <div className='max-w-md flex justify-end'>
          <AlertDialogTrigger asChild>
            <Button variant='outline' size='icon' aria-label='delete house'>
              <Trash2Icon className='h-4 w-4' />
            </Button>
          </AlertDialogTrigger>
        </div>
        <AlertDialogContent className='sm:max-w-[425px]'>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete house</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            <span className='text=cen'>
              Are you sure you want to delete{' '}
              <strong>{houseScore.house.address}?</strong>
            </span>
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className='variant-destructive'>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  const getTableRow = () => {
    return housesScore.map((houseScore) => {
      return (
        <TableRow key={houseScore.house.id}>
          <TableCell>{houseScore.house.address}</TableCell>
          <TableCell className='text-center'>
            {houseScore.score.toFixed(2)}
          </TableCell>
          <TableCell className='flex justify-end'>
            <EditHouse />
            <DeleteHouse houseScore={houseScore} />
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <div className='md:max-2xl md:max-xl md:max-md md:max-sm'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>House</TableHead>
            <TableHead className='text-center'>Score</TableHead>
            <TableHead className='text-end'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{getTableRow()}</TableBody>
      </Table>
    </div>
  );
}
