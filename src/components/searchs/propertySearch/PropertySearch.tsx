import { Radio } from "antd";
import { MoveRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import { Button } from "../../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Slider } from "../../ui/slider";

interface PopoverRangeProps {
  name: string;
  label: string;
  option: Array<any>;
  minValue?: number;
  maxValue?: number;
  minDefault?: number;
  maxDefault?: number;
}
const PropertySearch: React.FC<PopoverRangeProps> = ({
  name,
  label,
  option,
  minValue,
  maxValue,
  minDefault,
  maxDefault,
}) => {
  const form = useForm({
    defaultValues: {
      [name]: [minDefault || 0, maxDefault || 0],
    },
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const submitData = (data: any) => {
    if (name === "price") {
      if (data.price[0] !== null && data.price[1] !== null) {
        searchParams.set("minPrice", data.price[0].toString());
        searchParams.set("maxPrice", data.price[1].toString());
      } else {
        searchParams.delete("minPrice");
        searchParams.delete("maxPrice");
      }
    }
    if (name === "size") {
      if (data.size[0] !== null && data.size[1] !== null) {
        searchParams.set("minSquareMeter", data.size[0]);
        searchParams.set("maxSquareMeter", data.size[1]);
      } else {
        searchParams.delete("minSquareMeter");
        searchParams.delete("maxSquareMeter");
      }
    }
    searchParams.delete("page");
    setSearchParams(searchParams);
  };
  return (
    <div className="border-b border-border-color-12 border-opacity-25">
      <h5 className="mb-25px text-lg text-heading-color font-semibold">
        <span className="leading-1.3">{label}</span>
      </h5>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitData)}>
          <FormField
            name={name}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="flex flex-col items-center">
                      <p className="text-xs font-bold mb-2">{`${label} thấp nhất`}</p>
                      <Input
                        type={"number"}
                        placeholder="Từ"
                        className="w-full appearance-none"
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
                        className="w-full appearance-none"
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
                <FormControl className="flex flex-col gap-y-15px">
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
                          className=" text-sm font-bold flex justify-between items-center "
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
          <div className="flex items-center p-4 justify-end h-[57px] border-t">
            <Button type="submit">Áp dụng</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PropertySearch;
