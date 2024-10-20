import Link from "next/link";
import { FC } from "react";

interface NavLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
  active: boolean;
}

const NavLink: FC<NavLinkProps> = ({ href, label, onClick, active }) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${
        active ? "border-b-2 border-white" : ""
      } text-white hover:text-gray-300`}
    >
      {label}
    </Link>
  );
};

export default NavLink;
