import React from 'react';

interface DataPageTemplateProps {
    error: string | null;
    loading?: boolean;
    children: React.ReactNode;
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
                <div className="text-center text-danger">
                    <h3 className="text-lg font-semibold">Error</h3>
                    <p>{error}</p>
                </div>
            </section>
        );
    }

    return <>{children}</>;
};
