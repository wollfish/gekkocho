'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Tooltip } from '@nextui-org/tooltip';
import { useNetwork } from 'ahooks';
import { toast } from 'sonner';

export const NetworkStatusIndicator: React.FC = React.memo(() => {
    const { online: initialOnline } = useNetwork();
    const [online, setOnline] = useState<boolean | null>(null);
    const prevOnlineRef = useRef<boolean | null>(null);

    useEffect(() => {
        setOnline(initialOnline);
    }, [initialOnline]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (prevOnlineRef.current === false && online === true) {
                const reloadTimeout = setTimeout(() => {
                    window.location.reload();
                }, 3000);

                return () => clearTimeout(reloadTimeout);
            }

            prevOnlineRef.current = online;

            if (!online && online !== null) {
                toast.warning('You are offline.', {
                    dismissible: false,
                    closeButton: false,
                    position: 'bottom-right',
                    duration: 99999,
                    id: 'network-status-alert',
                });
            } else {
                toast.dismiss('network-status-alert');
            }
        }
    }, [online]);

    const basePingClass = 'absolute inline-flex size-full animate-ping rounded-full opacity-75';
    const baseDotClass = 'relative inline-flex size-2 rounded-full';

    const pingClass = `${basePingClass} ${
        online === null ? 'bg-gray-400' : online ? 'bg-green-400 !animate-none' : 'bg-red-400'
    }`;

    const dotClass = `${baseDotClass} ${
        online === null ? 'bg-gray-500' : online ? 'bg-green-500' : 'bg-red-500'
    }`;

    const tooltipContent = online === null ? 'Checking...' : online ? 'Online' : 'Offline';

    return (
        <Tooltip content={tooltipContent} showArrow={true}>
            <span className="relative flex size-2 cursor-pointer">
                <span className={pingClass}/>
                <span className={dotClass}/>
            </span>
        </Tooltip>
    );
});
