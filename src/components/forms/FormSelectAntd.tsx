import { Select } from "antd";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
interface Option {
  label: string;
  value: string | number;
}
interface FormSelectProps {
  form: UseFormReturn<any>;
  label?: string;
  name: string;
  ClassNameLable?: string;
  classSelect?: string;
  Placeholder?: string;
  options: Option[];
  disabled?: boolean;
  handleChange?: (data: any) => Promise<void>;
}
const FormSelectAntd: React.FC<FormSelectProps> = ({
  form,
  label,
  name,
  ClassNameLable,
  Placeholder,
  options,
  classSelect,
  disabled = false,
  handleChange,
}) => {
  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => {
        return (
          <FormItem className="mb-4 ">
            {label && <FormLabel className={ClassNameLable}>{label}</FormLabel>}
            <FormControl>
              <Select
                placeholder={Placeholder}
                onChange={
                  handleChange ? handleChange : (value) => field.onChange(value)
                }
                value={field.value ? field.value : undefined} //cần chỉnh lại
                className={classSelect}
                style={{ border: "none" }}
                disabled={disabled}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                {options.map((items, index) => (
                  <Select.Option key={index} value={items.value}>
                    {items.label}
                  </Select.Option>
                ))}
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default FormSelectAntd;
