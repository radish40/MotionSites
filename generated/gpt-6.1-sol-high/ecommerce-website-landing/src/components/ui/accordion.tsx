import * as React from 'react';
import * as Primitive from '@radix-ui/react-accordion';
import { Plus } from 'lucide-react';
export const Accordion=Primitive.Root;
export const AccordionItem=Primitive.Item;
export const AccordionTrigger=React.forwardRef<React.ElementRef<typeof Primitive.Trigger>,React.ComponentPropsWithoutRef<typeof Primitive.Trigger>>(({children,...props},ref)=><Primitive.Header><Primitive.Trigger ref={ref} className="faq-trigger" {...props}>{children}<Plus size={24} className="faq-plus"/></Primitive.Trigger></Primitive.Header>);
export const AccordionContent=React.forwardRef<React.ElementRef<typeof Primitive.Content>,React.ComponentPropsWithoutRef<typeof Primitive.Content>>(({children,...props},ref)=><Primitive.Content ref={ref} className="faq-content" {...props}><div>{children}</div></Primitive.Content>);
