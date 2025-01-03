import React, { useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Radio } from "antd";

interface Option {
  id: string;
  label: string;
  value: {
    id: string;
    listingType: string;
  };
}
interface SearchProperty {
  id: string;
  province: string;
  minPrice: number | null;
  maxPrice: number | null;
  minSquareMeter: number | null;
  maxSquareMeter: number | null;
  PropertyTypeId: string | null;
  listingType: string | null;
}
interface PopoverCheckBoxProps {
  name: string;
  label: string;
  option: Array<Option>;
  setSearchProperty: React.Dispatch<React.SetStateAction<SearchProperty>>;
}

interface FormValues {
  [key: string]: {
    id: string;
    listingType: string;
  };
}

const PopoverCheckBox: React.FC<PopoverCheckBoxProps> = ({
  label,
  option,
  name,
  setSearchProperty,
}) => {
  const [widthContent, setWidthContent] = useState<number>(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setisOpen] = useState(false);
  const form = useForm<FormValues>({
    defaultValues: {
      [name]: {
        id: "",
        listingType: "",
      },
    },
  });
  useEffect(() => {
    if (triggerRef.current) {
      const width = triggerRef.current.getBoundingClientRect()?.width;
      setWidthContent(width);
    }
  }, []);
  const submitData = (data: any) => {
    setSearchProperty((prev) => ({
      ...prev,
      PropertyTypeId: data.postType.id,
      listingType: data.postType.listingType,
    }));
    setisOpen(false);
  };
  return (
    <Popover open={isOpen}>
      <PopoverTrigger
        ref={triggerRef}
        onClick={() => setisOpen(true)}
        className="border rounded-md py-2 px-4 "
      >
        {label}
      </PopoverTrigger>
      <PopoverContent
        style={{ width: `${widthContent}px` }}
        className="p-0 relative h-[364px]"
      >
        <div className="p-4 flex items-center justify-center border-b">
          <p className="font-bold">{label}</p>
          <Button
            variant={"secondary"}
            className="absolute right-1 top-1 bottom-0"
            onClick={() => {
              setisOpen(false);
              form.reset();
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </Button>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitData)}>
            <div className="p-4 space-y-4 max-h-[250px] overflow-y-auto">
              <FormField
                name={name}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl className="w-full">
                      <Radio.Group
                        value={JSON.stringify(form.watch(name))}
                        onChange={(e) => {
                          const selectedValue = JSON.parse(e.target.value);
                          form.setValue(name, selectedValue);
                        }}
                      >
                        {option.map((el) => {
                          return (
                            <FormItem
                              key={el.id}
                              className="flex items-center justify-between"
                            >
                              <FormLabel>{el.label}</FormLabel>
                              <Radio value={JSON.stringify(el.value)} />
                            </FormItem>
                          );
                        })}
                      </Radio.Group>
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-end h-[57px] border-t">
                <Button type="submit">Áp dụng</Button>
              </div>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverCheckBox;
