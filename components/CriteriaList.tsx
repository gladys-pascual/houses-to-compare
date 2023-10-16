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
import CreateCriterion from './CreateCriterion/CreateCriterion';
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
import { Decimal } from '@prisma/client/runtime/library';

type CriteriaListProps = {
  criterion: {
    id: number;
    factor: string;
    weight: Decimal;
    criteriaId: number | null;
  }[];
};

export default async function CriteriaList({ criterion }: CriteriaListProps) {
  const tableRow = () => {
    return criterion?.map((cri) => (
      <TableRow key={cri.id}>
        <TableCell className='font-medium'>{cri.factor}</TableCell>
        <TableCell className='text-center'>{cri.weight.toString()}</TableCell>
        <TableCell className='flex justify-end'>
          <Dialog>
            <div className='max-w-md flex justify-end'>
              <DialogTrigger className='mb-4' asChild>
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
                    value={cri.factor}
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
                    value={cri.weight.toString()}
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

          <AlertDialog>
            <div className='max-w-md flex justify-end'>
              <AlertDialogTrigger className='mb-4' asChild>
                <Button
                  variant='outline'
                  size='icon'
                  aria-label='delete criteria'
                >
                  <Trash2Icon className='h-4 w-4' />
                </Button>
              </AlertDialogTrigger>
            </div>
            <AlertDialogContent className='sm:max-w-[425px]'>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Criteria</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription>
                {/* // todo: make factor bold or stand out */}
                {'Are you sure you want to delete ' + `${cri.factor}` + '?'}
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className='variant-destructive'>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div>
      <CreateCriterion isCriteriaEmpty={!criterion?.length} />
      <Table className='max-w-md'>
        <TableHeader>
          <TableRow>
            <TableHead>Factor</TableHead>
            <TableHead className='text-center'>Weight</TableHead>
            <TableHead className='text-end'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{tableRow()}</TableBody>
      </Table>
    </div>
  );
}
