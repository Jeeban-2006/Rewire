import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mic, Camera, Plus } from 'lucide-react';

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTaskDialog({ open, onOpenChange }: AddTaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to your board. You can also add tasks using your voice or a photo.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Task Title</Label>
            <Input id="title" placeholder="e.g., Finish project proposal" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea id="description" placeholder="Add more details about the task..." />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Mic className="mr-2 h-4 w-4" />
              Add with Voice
            </Button>
            <Button variant="outline" className="flex-1">
              <Camera className="mr-2 h-4 w-4" />
              Add from Photo
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
