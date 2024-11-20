import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";

const CheckResetPass = () => {
  const { data: session, status } = useSession();
  const { data: variableData } = api.variables.getVariable.useQuery({ key: "reset-pass" });

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.role === "admin" &&
      variableData?.value === "default"
    ) {
      toast.error("Reset Password is not set. Please change immediately.");
    }
  }, [status, session, variableData]);

  return null;
};

export default CheckResetPass;
