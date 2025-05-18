import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getRegisteredUsers = () => {
  try {
    const storedUsers = localStorage.getItem("agriconnect_registered_users")
    if (storedUsers) {
      return JSON.parse(storedUsers).map((user: any) => {
        const { password, ...userWithoutPassword } = user
        return userWithoutPassword
      })
    }
    return []
  } catch (error) {
    console.error("Failed to parse stored users:", error)
    return []
  }
}
