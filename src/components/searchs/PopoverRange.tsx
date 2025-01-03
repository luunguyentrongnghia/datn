import { Radio } from "antd";
import { MoveRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Slider } from "../ui/slider";

interface SearchProperty {
  id: string;
  province: string;
  minPrice: number | null;
  maxPrice: number | null;
  maxSquareMeter: number | null;
  minSquareMeter: number | null;
  PropertyTypeId: string | null;
  listingType: string | null;
}
interface PopoverRangeProps {
  name: string;
  label: string;
  option: Array<any>;
  minValue?: number;
  maxValue?: number;
  minMetter?: number;
  maxMetter?: number;
  setSearchProperty: React.Dispatch<React.SetStateAction<SearchProperty>>;
}
const PopoverRange: React.FC<PopoverRangeProps> = ({
  name,
  label,
  option,
  minValue,
  maxValue,
  minMetter,
  maxMetter,
  setSearchProperty,
}) => {
  const form = useForm({
    defaultValues: {
      [name]: [0, 0],
    },
  });
  const triggerRef = useRef<any>(null);
  const [widthContent, setWidthContent] = useState<number>(0);
  const [isOpen, setisOpen] = useState(false);
  useEffect(() => {
    if (triggerRef.current) {
      const width = triggerRef.current.getBoundingClientRect()?.width;
      setWidthContent(width);
    }
  }, []);
  const submitData = (data: any) => {
    if (name === "price") {
      setSearchProperty((prev) => ({
        ...prev,
        minPrice: data.price[0],
        maxPrice: data.price[1],
      }));
    }
    if (name === "size") {
      setSearchProperty((prev) => ({
        ...prev,
        minSquareMeter: data.size[0],
        maxSquareMeter: data.size[1],
      }));
    }
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
        className="p-0  relative h-[364px]"
      >
        <div className="p-4 flex items-center justify-center boder-b">
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
                  <FormItem className="py-8">
                    <FormControl>
                      <div className="flex items-center justify-center gap-4">
                        <div className="flex flex-col items-center">
                          <p className="text-xs font-bold mb-2">{`${label} thấp nhất`}</p>
                          <Input
                            type={"number"}
                            placeholder="Từ"
                            className="w-[90px] appearance-none"
                            min="0"
                            value={field.value[0] || ""}
                            onChange={(event) => {
                              const val = Number(event.target.value) || 0;
                              field.onChange([val, field.value[1]]);
                            }}
                          />
                        </div>
                        <MoveRight size={16} className="mt-6" />
                        <div className="flex flex-col items-center">
                          <p className="text-xs font-bold mb-2">{`${label} cao nhất`}</p>
                          <Input
                            type={"number"}
                            placeholder="Đến"
                            className="w-[90px] appearance-none"
                            min="0"
                            value={field.value[1] || ""}
                            onChange={(event) => {
                              const val = Number(event.target.value) || 0;
                              field.onChange([field.value[0], val]);
                            }}
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormControl>
                      <Slider
                        value={field.value}
                        onValueChange={(val) => field.onChange(val)}
                        max={maxValue}
                        min={minValue}
                        step={1}
                      />
                    </FormControl>
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
            </div>
            <div className="flex items-center p-4 justify-end h-[57px] border-t">
              <Button type="submit">Áp dụng</Button>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverRange;
