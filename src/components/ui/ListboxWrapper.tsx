import React from 'react';

export const ListboxWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div
            className="w-full px-1 py-2">
            {children}
        </div>
    );
};
