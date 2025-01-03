import { resetOutline } from "@/lib/classname";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface FormInputProps {
  form: UseFormReturn<any>;
  label?: string;
  name: string;
  readOnly?: boolean;
  ClassNameInput?: string;
  ClassNameLable?: string;
  type?: string;
  Placeholder?: string;
  formatNumber?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  form,
  label,
  name,
  ClassNameInput,
  ClassNameLable,
  type = "text",
  formatNumber = false,
  Placeholder,
  readOnly = false,
}) => {
  const [formattedValue, setFormattedValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (formatNumber) {
      // Loại bỏ ký tự không phải số và định dạng lại với dấu phân cách hàng nghìn
      value = value.replace(/\D/g, "");
      setFormattedValue(new Intl.NumberFormat().format(Number(value)));
      form.setValue(name, Number(value));
    } else {
      setFormattedValue(value);
      form.setValue(name, value);
    }
  };
  const displayValue = (data: any) => {
    if (formatNumber) {
      const numericValue = data !== undefined ? Number(data) : 0;
      return new Intl.NumberFormat().format(numericValue);
    }
    return data ?? "";
  };
  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => {
        return (
          <FormItem className="mb-4">
            {label && (
              <FormLabel className={ClassNameLable}>{label}:</FormLabel>
            )}
            <FormControl>
              <Input
                type={type} // Giữ dạng text để hiển thị dấu phân cách cho số
                className={clsx(
                  ClassNameInput,
                  resetOutline,
                  readOnly && "cursor-not-allowed"
                )}
                placeholder={Placeholder}
                autoComplete={type === "password" ? "current-password" : "on"}
                readOnly={readOnly}
                min="0"
                {...field}
                value={displayValue(field.value)}
                onChange={handleChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default FormInput;
