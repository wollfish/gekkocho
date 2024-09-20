import React from 'react';
import { Spinner } from '@nextui-org/spinner';

export default function Loading() {
    return (
        <div className="flex size-full flex-col">
            <Spinner className="m-auto" color="success"/>
        </div>
    );
}
