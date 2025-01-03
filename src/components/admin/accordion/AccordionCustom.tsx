import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
interface AccordionProp {
  title: string;
  children: React.ReactNode;
}
const AccordionCustom: React.FC<AccordionProp> = ({ title, children }) => {
  return (
    <Accordion
      type="single"
      collapsible
      className="flex items-center justify-center  mb-8 text-sm font-semibold text-purple-100 bg-purple-600 rounded-lg shadow-md focus:outline-none focus:shadow-outline-purple"
    >
      <AccordionItem value="item-1" className="w-[95%]">
        <AccordionTrigger className="flex justify-between text-white font-semibold text-[20px] focus:outline-none">
          {title}
        </AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AccordionCustom;
