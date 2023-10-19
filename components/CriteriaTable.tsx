import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pen } from 'lucide-react';
import { Trash2Icon } from 'lucide-react';
import CreateCriterion from './CreateCriterion';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WeightIconInfo } from './WeightInfoIcon';
import { Criterion } from '@prisma/client';

type CriteriaTableProps = {
  criterionList: Criterion[];
};

export default async function CriteriaTable({
  criterionList,
}: CriteriaTableProps) {
  const EditCriterion = ({ criterion }: { criterion: Criterion }) => {
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
            <DialogTitle>Edit Criteria</DialogTitle>
            <DialogDescription>description</DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid  items-center gap-4'>
              <Label htmlFor='factor'>Factor</Label>
              <Input
                id='factor'
                value={criterion.factor}
                className='col-span-3'
              />
            </div>
            <div className='grid  items-center gap-4'>
              <div className='flex items-center'>
                <Label htmlFor='weight' className='pr-1'>
                  Weight
                </Label>
                <WeightIconInfo />
              </div>
              <Input
                id='weight'
                value={criterion.weight.toString()}
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

  const DeleteCriterion = ({ criterion }: { criterion: Criterion }) => {
    return (
      <AlertDialog>
        <div className='max-w-md flex justify-end'>
          <AlertDialogTrigger asChild>
            <Button variant='outline' size='icon' aria-label='delete criteria'>
              <Trash2Icon className='h-4 w-4' />
            </Button>
          </AlertDialogTrigger>
        </div>
        <AlertDialogContent className='sm:max-w-[425px]'>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Criteria</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            <span className='text=cen'>
              Are you sure you want to delete factor{' '}
              <strong>{criterion.factor}</strong> with weight of{' '}
              <strong>{criterion.weight.toString()}</strong>?
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
    return criterionList?.map((criterion) => (
      <TableRow key={criterion.id}>
        <TableCell>{criterion.factor}</TableCell>
        <TableCell className='text-center'>
          {criterion.weight.toString()}
        </TableCell>
        <TableCell className='flex justify-end'>
          <EditCriterion criterion={criterion} />
          <DeleteCriterion criterion={criterion} />
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className='md:max-2xl md:max-xl md:max-md md:max-sm'>
      <CreateCriterion isCriteriaEmpty={!criterionList?.length} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Factor</TableHead>
            <TableHead className='text-center'>Weight</TableHead>
            <TableHead className='text-end'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{getTableRow()}</TableBody>
      </Table>
    </div>
  );
}
