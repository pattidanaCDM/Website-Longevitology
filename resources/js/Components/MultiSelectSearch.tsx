import React, { useState, useRef, useEffect } from "react";
import { X, Search } from "lucide-react";

interface Option {
    id: string | number;
    name: string;
}

interface MultiSelectSearchProps {
    options: Option[];
    value: (string | number)[];
    onChange: (value: (string | number)[]) => void;
    placeholder?: string;
}

export default function MultiSelectSearch({
    options,
    value,
    onChange,
    placeholder = "Search and select...",
}: MultiSelectSearchProps) {
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const selectedOptions = options.filter((opt) => value.includes(opt.id.toString()) || value.includes(opt.id));
    
    // Filter available options based on search text and exclude already selected ones
    const availableOptions = options.filter(
        (opt) =>
            !value.includes(opt.id.toString()) &&
            !value.includes(opt.id) &&
            opt.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (id: string | number) => {
        onChange([...value, id.toString()]);
        setSearch("");
    };

    const handleRemove = (id: string | number) => {
        onChange(value.filter((v) => v.toString() !== id.toString()));
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="flex flex-wrap gap-2 mb-2">
                {selectedOptions.map((opt) => (
                    <span
                        key={opt.id}
                        className="flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded-md text-sm"
                    >
                        {opt.name}
                        <button
                            type="button"
                            onClick={() => handleRemove(opt.id)}
                            className="hover:text-red-500 focus:outline-none"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
            </div>

            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md leading-5 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder={placeholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                />
            </div>

            {isOpen && availableOptions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto sm:text-sm">
                    {availableOptions.map((opt) => (
                        <div
                            key={opt.id}
                            className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:text-gray-100"
                            onClick={() => handleSelect(opt.id)}
                        >
                            <span className="block truncate">{opt.name}</span>
                        </div>
                    ))}
                </div>
            )}
            
            {isOpen && search !== "" && availableOptions.length === 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 shadow-lg max-h-60 rounded-md py-2 px-3 text-sm text-gray-500 dark:text-gray-400 ring-1 ring-black ring-opacity-5">
                    No branches found.
                </div>
            )}
        </div>
    );
}
