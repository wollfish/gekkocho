'use client';

import React, { useEffect } from 'react';
import * as qr from '@bitjson/qr-code';
import { Spinner } from '@nextui-org/spinner';
import { useEventListener } from 'ahooks';
import Image from 'next/image';

interface OwnProps {
    value: string;
    size?: 'small' | 'medium' | 'large';
}

const sizes = {
    small: { width: '160px', height: '160px' },
    medium: { width: '200px', height: '200px' },
    large: { width: '250px', height: '250px' },
};

export const QRCodeGenerator: React.FC<OwnProps> = (props) => {
    const { value, size = 'small' } = props;

    const qrRef = React.useRef(null);
    const logoRef = React.useRef(null);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.customElements && !window.customElements.get('qr-code')) {
            qr.defineCustomElements(window);
        }
    }, []);

    useEventListener('codeRendered', () => {
        if (qrRef.current) {
            qrRef.current.animateQRCode('FadeInTopDown');
            logoRef.current.classList.remove('hidden');
            setLoading(false);
        }
    }, { target: qrRef });

    return (
        <div className="relative mx-auto flex items-center justify-center" style={sizes[size]}>
            {loading && <Spinner className="absolute inset-0" color="default"/>}
            {/*@ts-ignore*/}
            <qr-code
                ref={qrRef}
                className="relative"
                contents={value}
                module-color="#ff8e5a"
                position-center-color="#ff8e5a"
                position-ring-color="#bf6331"
            >
                <Image
                    ref={logoRef}
                    alt=""
                    className="hidden"
                    height="64"
                    slot="icon"
                    src="/images/logo.svg"
                    width="64"
                />
            </qr-code>
        </div>
    );
};