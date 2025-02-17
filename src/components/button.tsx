import * as React from "react"

export default function Button({ asChild = false, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const Comp = asChild ? "span" : "button"

  return (
    <Comp
      className={`w-full mt-6 bg-primary text-white font-roboto py-2 px-4 rounded-lg cursor-pointer disabled:bg-gray-400 ${className}`}
      {...props}
    />
  )
}
