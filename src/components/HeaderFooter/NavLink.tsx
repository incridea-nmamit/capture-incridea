// NavLink.tsx
import { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
  className?: string; // Allow className prop
}

const NavLink: FC<NavLinkProps> = ({ href, label, active, onClick, className = "" }) => {
  const activeClass = active ? "border-b-2 border-white" : "";

  return (
    <Link href={href} className={`${activeClass} ${className}`} onClick={onClick}>
      {label}
    </Link>
  );
};

export default NavLink;
