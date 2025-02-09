/**
 * Search Input Component
 * A styled search input with an icon
 * Features:
 * - Built-in search icon
 * - Custom styling for dashboard
 * - Responsive design
 */
import { FaSearch } from "react-icons/fa";
import { cn } from "~/lib/utils";

// Main search input component with icon
const SearchInput: React.FC<React.ComponentPropsWithoutRef<'input'>> = ({ children,className,placeholder, ...rest }) => {
    return <div className="relative w-full dashboard-search">
        <input
            type="text"
            placeholder={placeholder ?? "Search..."}
            className={cn("font-Trap-Regular text-white p-2 pl-10 border border-slate-700 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-white h-12 bg-neutral-950", className)}
            {...rest}
        />
        <div className="absolute left-3 top-6 transform -translate-y-1/2 text-gray-600">
            <FaSearch />
        </div>
    </div>;
};

export default SearchInput;
