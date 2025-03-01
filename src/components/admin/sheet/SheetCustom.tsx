import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FormProvider, UseFormReturn } from "react-hook-form";
interface SheetProp {
  title: string;
  children: React.ReactNode;
  form: UseFormReturn<any>;
  onSubmit: (data: object) => void;
  classNameSheet?: string;
}
const SheetCustom: React.FC<SheetProp> = ({
  title,
  children,
  form,
  onSubmit,
  classNameSheet,
}) => {
  return (
    <SheetContent className={classNameSheet}>
      <SheetHeader>
        <SheetTitle>{title}</SheetTitle>
      </SheetHeader>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {children}
          <SheetFooter>
            <SheetClose asChild>
              <Button
                className="text-white bg-purple-600 font-bold"
                type="submit"
              >
                Cập nhật
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </FormProvider>
    </SheetContent>
  );
};

export default SheetCustom;
