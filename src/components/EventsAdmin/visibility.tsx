"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api"; // Adjust this path as needed


import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

type ToggleVisibilityButtonProps = {
  id: number;
  name: string;
  visibility: boolean;
};

const ToggleVisibilityButton: React.FC<ToggleVisibilityButtonProps> = ({
  id,
  name,
  visibility,
}) => {
  const { data: session } = useSession();
  const [isVisible, setIsVisible] = useState(visibility);

  // Mutation for updating visibility
  const updateVisibility = api.events.updateEventVisibility.useMutation();

  // Mutation for logging the audit event
  const auditLogMutation = api.audit.log.useMutation();

  const handleToggle = async () => {
    const newValue = !isVisible;

    try {
      // Update visibility status
      await updateVisibility.mutateAsync({ id });

      // Log the visibility change in the audit log
      await auditLogMutation.mutateAsync({
        sessionUser: session?.user.name || "Invalid User",
        description: `${name} visibility set to ${newValue}`,
        audit: "EventManagementAudit",
      });

      // Show success notification
      toast.success(`${name} visibility set to ${newValue}`);
      setIsVisible(newValue); // Update local state to reflect the change
    } catch (error) {
      console.error(error);
      toast.error("Failed to update visibility");
    }
  };

  return <Switch id={`toggle-${id}`} checked={isVisible} onCheckedChange={handleToggle} />
      


};

export default ToggleVisibilityButton;
