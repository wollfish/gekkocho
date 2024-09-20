import React from 'react';

export default function LoginLayout({ children }: { children: React.ReactNode; }) {
    return (
        <div className="m-auto flex">
            {children}
        </div>
    );
}
