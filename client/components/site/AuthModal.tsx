import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import AuthPanel from "./AuthPanel";

export default function AuthModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[92vh] w-[95vw] max-w-3xl gap-0 overflow-y-auto border-0 p-0 sm:rounded-3xl [&>button]:z-40 [&>button]:rounded-full [&>button]:bg-white/90 [&>button]:p-1.5 [&>button]:opacity-100 [&>button]:shadow"
      >
        <DialogTitle className="sr-only">Login / Register</DialogTitle>
        <DialogDescription className="sr-only">Sign in to the Student Portal or create a new account.</DialogDescription>
        <AuthPanel onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
