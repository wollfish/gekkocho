import React from 'react';

export default function Layout({ children }: { children: React.ReactNode; }) {
    return (
        <div className="m-auto flex">
            {children}
        </div>
    );
}
