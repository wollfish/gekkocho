import React from 'react';

import { cn } from '@/lib/utils';

const AvailableIcon = [
    'ada', 'algo', 'atom', 'avax',
    'bch', 'bnb', 'btc', 'busd',
    'doge', 'dot',
    'eth',
    'ftm', 'ftt',
    'gala',
    'inr',
    'link', 'ltc', 'luna',
    'mana', 'matic',
    'near',
    'sand', 'shib', 'sol', 'sushi',
    'trx',
    'uni', 'usd', 'usdt',
    'xlm', 'xrp',
] as const;

type IconName = typeof AvailableIcon[number];

interface OwnProps {
    /**
     * name of the icon
     */
    code: IconName | string;
    /**
     * size of the icon in px, rem, em, percentage...
     */
    size?: string | number;
    /**
     * custom class name
     */
    customClass?: string;
    /**
     * alternative url / path to the icon
     */
    altIconUrl?: string;
}

export const CryptoIcon: React.FC<OwnProps> = React.memo((props) => {
    const { code, altIconUrl, size = 24, customClass } = props;

    const cx = cn(customClass);

    if (AvailableIcon.includes(code?.toLowerCase() as IconName)) {
        return (
            <svg className={cx} height={size} width={size}>
                <use xlinkHref={`/crypto_icon/crypto_icons.svg#icon-${code.toLowerCase()}`}/>
            </svg>
        );
    } else {
        return (
            <img alt="" className={cx} height={size} src={altIconUrl} width={size}/>
        );
    }
});
