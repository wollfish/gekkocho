import React from 'react';

import { description, subtitle } from '@/components/primitives';

interface DataPageTemplateProps {
    error: string | null;
    loading?: boolean;
    children?: React.ReactNode;
}

export const DataPageTemplate: React.FC<DataPageTemplateProps> = (props) => {
    const { error, loading, children } = props;

    if (loading) {
        return (
            <section className="flex flex-1 items-center justify-center py-4">
                <span className="text-default-500">Loading...</span>
            </section>
        );
    }

    if (error) {
        return (
            <section className="flex flex-1 items-center justify-center py-4">
                <div className="m-auto">
                    <h2 className={subtitle({ className: 'relative text-danger pl-1' })}>
                        <span>Error</span>
                        <span className="absolute left-0 top-1 h-4/6 w-0.5 bg-danger"/>
                    </h2>
                    <p className={description({ className: 'm-0', size: 'xs' })}>
                        {error}
                    </p>
                </div>
            </section>
        );
    }

    return <>{children}</>;
};
