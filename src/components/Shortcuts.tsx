/**
 * Global keyboard shortcut handler
 * Features:
 * - Multi-key combination support
 * - Role-based shortcuts
 * - Navigation triggers
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";

const KeyboardShortcut = () => {
  // State for tracking pressed keys
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    /**
     * Handles keydown events and triggers shortcuts
     */
    const handleKeydown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const newPressedKeys = new Set(pressedKeys);
      newPressedKeys.add(key);

      if (event.shiftKey) {
        newPressedKeys.add("shift");
      }

      setPressedKeys(newPressedKeys);

      // Check for Shift + A
      if (newPressedKeys.has("shift") && newPressedKeys.has("a") && newPressedKeys.has("s")) {
        router.push("/admin/dashboard");
      }
      
      // Check for Shift + A + N
      if (status === 'authenticated' && session?.user?.role === 'admin') {
        if (newPressedKeys.has("shift") && newPressedKeys.has("a") && newPressedKeys.has("n")) {
            router.push("/admin/analytics");
        }
      }      
    };

    /**
     * Handles keyup events and cleans up pressed keys
     */
    const handleKeyup = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const newPressedKeys = new Set(pressedKeys);
      newPressedKeys.delete(key);

      if (!event.shiftKey) {
        newPressedKeys.delete("shift");
      }

      setPressedKeys(newPressedKeys);
    };

    // Event listener setup and cleanup
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("keyup", handleKeyup);

    // Clean up listeners
    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("keyup", handleKeyup);
    };
  }, [pressedKeys, router]);

  return null; 
};

export default KeyboardShortcut;
