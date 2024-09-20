import React from 'react';

import { pageConstants } from '@/constant';
import { cn } from '@/lib/utils';

interface OwnProps {
    className?: string;
}

export const LogoCarousel: React.FC<OwnProps> = (props) => {
    const { className } = props;

    return (
        <div
            className={cn('inline-flex w-full flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]', className)}
        >
            <ul className="flex animate-infinite-scroll items-center justify-center md:justify-start [&_img]:max-w-none [&_li]:mx-8">
                {pageConstants.landing.cryptoIcons.map((c, index) => (
                    <li key={c.name + index + 'first'}>
                        <c.icon fill={c.fill} size="36" title={c.name}/>
                    </li>
                ))}
            </ul>
            <ul className="flex animate-infinite-scroll items-center justify-center md:justify-start [&_img]:max-w-none [&_li]:mx-8">
                {pageConstants.landing.cryptoIcons.map((c, index) => (
                    <li key={c.name + index + 'sec'}>
                        <c.icon fill={c.fill} size="36" title={c.name}/>
                    </li>
                ))}
            </ul>
        </div>
    );
};
