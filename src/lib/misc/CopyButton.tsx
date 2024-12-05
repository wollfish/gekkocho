'use client';

import React from 'react';
import { Snippet } from '@nextui-org/snippet';

interface OwnProps {
    text: string;
}

export const YukiCopyButton: React.FC<OwnProps> = (props) => {
    return (
        <Snippet
            hideSymbol
            classNames={{ pre: 'pl-1 break-all whitespace-normal' }}
            radius="sm"
            size="sm"
        >
            {`${window.origin}/pay/${props.text}`}
        </Snippet>
    );

};
