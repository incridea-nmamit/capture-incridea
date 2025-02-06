"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, Trash } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { api } from "~/utils/api";
import { Input } from "../ui/input";
import { ScrollArea } from "~/components/ui/scroll-area"
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,  DialogFooter } from "../ui/dialog";

type Props = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

export function CategoryBox({ isOpen, setOpen }: Props) {
  const { data: categories, isLoading, refetch } = api.storycat.getAllCategories.useQuery();
  const addCategory = api.storycat.addCat.useMutation({
    onSuccess: () => refetch(),
  });

  const deleteCategory = api.storycat.deleteCategory.useMutation({
    onSuccess: () => refetch(),
  });

  const [value, setValue] = React.useState<number | null>(null);
  const [newCategory, setNewCategory] = React.useState("");
  const [isOpens, setopens] = React.useState(false)
  const [category, setCategory] = React.useState("");
  const [categoryId, setCategoryId] = React.useState<number | null>(null);


  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory.mutate({ name: newCategory }, {
        onSuccess: () => {
          toast.success("Category Added successfully");
        }
      });
      setNewCategory("");
    }
  };

  const handleDeleteCategory = () => {
    deleteCategory.mutate({ id: categoryId! }, {
      onSuccess: () => {
        toast.success("Category deleted successfully");
      }
    });

  };

  return (
    <>
      <Popover open={isOpen} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="w-[200px] justify-between p-2 border border-slate-700 rounded-xl text-white h-12 bg-neutral-950 font-BebasNeue"
          >
            Category
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0" onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-row items-center gap-2 p-2 border-b">
            <Input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="border rounded p-1 text-sm w-full"
              placeholder="New"
            />
            <Button size="sm" onClick={handleAddCategory}>
              <Plus size={16} />
            </Button>
          </div>
          <Command>
            <ScrollArea className="h-52 w-full rounded-md">
              <CommandList>
                {isLoading ? (
                  <CommandEmpty>Loading...</CommandEmpty>
                ) : categories?.length ? (
                  <CommandGroup>
                    {categories.map((category) => (
                      <CommandItem
                        key={category.id}
                        value={category.id.toString()}
                        onSelect={() => setValue(category.id)}
                        className="flex justify-between items-center"
                      >
                        <span>{category.name}</span>
                        <button
                          onClick={() => { setopens(true); setCategory(category.name); setCategoryId(category.id); setopens(true) }}
                          className="ml-auto"
                        >
                          <Trash className="cursor-pointer text-red-500" />
                        </button>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : (
                  <CommandEmpty>No categories found.</CommandEmpty>
                )}
              </CommandList>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
      {
        isOpens && (
          <Dialog open={isOpens} onOpenChange={setopens}>
            <DialogContent className="sm:max-w-[425px] sapce-y-5">
              <DialogHeader>
                <DialogTitle>Delete Confirmation</DialogTitle>
                <DialogDescription>
                Are you sure you want to delete {category}?
                </DialogDescription>
                <DialogFooter>
                <div className="gap-4 flex items-center">
                  <Button
                 variant="destructive"
                    onClick={()=>{
                      handleDeleteCategory()
                    setopens(false)
                    }}
                  >Delete</Button>
                  <Button
                    onClick={() => setopens(false)}
                  >Close</Button>
                </div>
                </DialogFooter>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )
      }
    </>
  );
}
