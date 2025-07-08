"use client"

import { useToast } from "@/hooks/use-toast"
import { useTheme } from "@/hooks/useTheme"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()
  const { themeClasses } = useTheme()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        const toastClassName = variant === "destructive" 
          ? `${themeClasses.toastErrorBackground} ${themeClasses.toastErrorBorder} ${themeClasses.toastErrorText} backdrop-blur-md shadow-xl`
          : `${themeClasses.toastBackground} ${themeClasses.toastBorder} ${themeClasses.toastText} backdrop-blur-md shadow-xl`

        const titleClassName = variant === "destructive" 
          ? `${themeClasses.toastErrorText} font-semibold`
          : `${themeClasses.toastText} font-semibold`

        const descriptionClassName = variant === "destructive" 
          ? `${themeClasses.toastErrorText} opacity-90`
          : `${themeClasses.toastText} opacity-90`

        const closeClassName = variant === "destructive" 
          ? "text-red-300 hover:text-red-100"
          : `${themeClasses.text} hover:${themeClasses.text}`

        return (
          <Toast 
            key={id} 
            {...props}
            className={toastClassName}
          >
            <div className="grid gap-1">
              {title && (
                <ToastTitle className={titleClassName}>
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className={descriptionClassName}>
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className={closeClassName} />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
