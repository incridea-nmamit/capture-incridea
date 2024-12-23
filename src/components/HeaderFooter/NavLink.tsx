import { type FC } from "react";
import Link from "next/link";

interface NavLinkProps {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
  className?: string;
}

const NavLink: FC<NavLinkProps> = ({
  href,
  label,
  active,
  onClick,
  className = "",
}) => {
  const activeClass = active
    ? "bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text"
    : "";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group relative ${className} ${activeClass} text-white`}
    >
      {label}
      <span
        className="bg-gold absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-300 group-hover:w-full"
        aria-hidden="true"
      ></span>
    </Link>
  );
};

export default NavLink;
