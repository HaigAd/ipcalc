"use client"

import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { cn } from "../../../lib/utils"
import { MENUBAR_STYLES } from "./constants"
import { MenubarShortcutProps } from "./types"

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn(MENUBAR_STYLES.separator, className)}
    {...props}
  />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

const MenubarShortcut = ({
  className,
  ...props
}: MenubarShortcutProps) => {
  return (
    <span
      className={cn(MENUBAR_STYLES.shortcut, className)}
      {...props}
    />
  )
}
MenubarShortcut.displayName = "MenubarShortcut"

export { MenubarSeparator, MenubarShortcut }
