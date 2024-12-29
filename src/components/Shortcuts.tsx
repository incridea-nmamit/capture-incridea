import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";

const KeyboardShortcut = () => {
  const router = useRouter();
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
    const { data: session, status } = useSession();
  useEffect(() => {
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
      // Check for Shift + L (Logout)
      if (newPressedKeys.has("shift") && newPressedKeys.has("l")) {
        signOut();
      }
       // Check for Shift + LI (Login)
       if (newPressedKeys.has("shift") && newPressedKeys.has("i") && newPressedKeys.has("n")) {
        signIn();
      }
      // Check for Shift + A + N
    if (status === 'authenticated' && session?.user?.role === 'admin') {
        if (newPressedKeys.has("shift") && newPressedKeys.has("a") && newPressedKeys.has("n")) {
            router.push("/admin/analytics");
        }
    }      
    };

    const handleKeyup = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const newPressedKeys = new Set(pressedKeys);
      newPressedKeys.delete(key);

      if (!event.shiftKey) {
        newPressedKeys.delete("shift");
      }

      setPressedKeys(newPressedKeys);
    };

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
