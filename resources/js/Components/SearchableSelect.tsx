import { useState } from 'react';
import { Combobox } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';

export interface Option {
    id: number | string;
    label: string;
    description?: string;
}

interface Props {
    options: Option[];
    value: number | string | null;
    onChange: (value: number | string | null) => void;
    placeholder?: string;
    className?: string;
}

export default function SearchableSelect({ options, value, onChange, placeholder = 'Select an option...', className = '' }: Props) {
    const [query, setQuery] = useState('');

    const filteredOptions =
        query === ''
            ? options
            : options.filter((option) =>
                  option.label
                      .toLowerCase()
                      .replace(/\s+/g, '')
                      .includes(query.toLowerCase().replace(/\s+/g, ''))
              );

    const selectedOption = options.find((opt) => opt.id === value) || null;

    return (
        <div className={`relative ${className}`}>
            <Combobox value={selectedOption} onChange={(opt: Option | null) => onChange(opt ? opt.id : null)}>
                <div className="relative mt-1">
                    <div className="relative w-full cursor-default overflow-hidden rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-left shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 sm:text-sm">
                        <Combobox.Input
                            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 dark:text-gray-100 bg-transparent focus:ring-0"
                            displayValue={(option: Option | null) => option?.label ?? ''}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder={placeholder}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDown
                                className="h-4 w-4 text-gray-400"
                                aria-hidden="true"
                            />
                        </Combobox.Button>
                    </div>
                    <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-slate-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
                        {filteredOptions.length === 0 && query !== '' ? (
                            <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-300">
                                Nothing found.
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <Combobox.Option
                                    key={option.id}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                            active ? 'bg-indigo-600 text-white' : 'text-gray-900 dark:text-gray-100'
                                        }`
                                    }
                                    value={option}
                                >
                                    {({ selected, active }) => (
                                        <>
                                            <span
                                                className={`block truncate ${
                                                    selected ? 'font-medium' : 'font-normal'
                                                }`}
                                            >
                                                {option.label}
                                                {option.description && (
                                                    <span className={`ml-2 text-xs ${active ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'}`}>
                                                        {option.description}
                                                    </span>
                                                )}
                                            </span>
                                            {selected ? (
                                                <span
                                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                        active ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'
                                                    }`}
                                                >
                                                    <Check className="h-4 w-4" aria-hidden="true" />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Combobox.Option>
                            ))
                        )}
                    </Combobox.Options>
                </div>
            </Combobox>
        </div>
    );
}
