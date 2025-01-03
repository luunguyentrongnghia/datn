import React, { memo, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
interface MarkdownProps {
  form: UseFormReturn<any>;
  label?: string;
  name: string;
  ClassNameLable?: string;
}
const MarkdownEditor: React.FC<MarkdownProps> = ({
  form,
  label,
  name,
  ClassNameLable,
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
              <Editor
                apiKey={"lf1pim3ugwsyetniv4lqlor1s5h7key73q4iujx6dcrve5yr"}
                value={field.value}
                init={{
                  height: 500,
                  menubar: true,
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                  ],
                  toolbar:
                    "undo redo | formatselect | " +
                    "bold italic backcolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
                onEditorChange={(content) => {
                  field.onChange(content);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
export default memo(MarkdownEditor);
