import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"

export interface MenubarItemProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> {
  inset?: boolean
}

export interface MenubarLabelProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> {
  inset?: boolean
}

export interface MenubarSubTriggerProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> {
  inset?: boolean
}

export interface MenubarShortcutProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

export interface MenubarContentProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content> {
  align?: "start" | "center" | "end"
  alignOffset?: number
  sideOffset?: number
}

export interface MenubarCheckboxItemProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem> {}

export interface MenubarRadioItemProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem> {}
