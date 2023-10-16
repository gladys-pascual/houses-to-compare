import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';

export function WeightIconInfo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <InfoIcon
            size='16'
            aria-label='info tooltip icon to explain what weight is for'
            className='ml-2'
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>Weight is blah blah blah</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
