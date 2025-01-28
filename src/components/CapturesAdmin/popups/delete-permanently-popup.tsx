import {  useState } from "react";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,

} from "~/components/ui/alert-dialog"
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import UseRefetch from "~/hooks/use-refetch";
import { api } from "~/utils/api";

type Props = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  captureId: number;
}

export default function DeleteCapturePopUpModel({
  isOpen,
  setOpen,
  captureId
}
  : Props
) {
  const restoreImage = api.capture.deletecapturesPermanently.useMutation();
  const [loading, setLoading] = useState(false)
  const refetch = UseRefetch()
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Permanently?</DialogTitle>
          <DialogDescription>
          Are you sure you want to permanently delete this image from your gallery?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row items-center justify-start gap-2">
          <Button
            onClick={() => {
              setLoading(true);
              restoreImage
                .mutate({ id: captureId! },
                  {
                    onSuccess: () => {
                      toast.success("capture Deleted successfully");
                      refetch()
                      setLoading(false)
                      setOpen(false)
                    },
                    onError: () => {
                      toast.error("Couldnt Delete");
                      setLoading(false)
                    },
                  }
                )

            }}
          >
            {loading ? (
              <svg
                className="w-5 h-5 text-black animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : (
              "Delete"
            )}
          </Button>
          <Button
            onClick={() => {
              setOpen(false)
            }}
          >
            Cancel
          </Button>

        </div>


      </DialogContent>
    </Dialog>
  )
}
