import 'server-only';

import React from 'react';
import Image from 'next/image';

export const BackgroundGradient = () => {
    return (
        <React.Fragment>
            <div
                aria-hidden="true"
                className="fixed bottom-0 left-0 z-0 hidden select-none dark:opacity-70 dark:md:block"
            >
                <Image
                    alt="docs left background"
                    className="relative z-10 rounded-lg opacity-0 shadow-none shadow-black/5 !duration-300 transition-transform-opacity data-[loaded=true]:opacity-100 motion-reduce:transition-none"
                    data-loaded="true"
                    height={400}
                    priority={false}
                    src="/images/docs-left.png"
                    width={400}
                />
            </div>
            <div
                aria-hidden="true"
                className="fixed right-[-60%] top-[-80%] z-0 hidden rotate-12 select-none dark:opacity-70 dark:md:block 2xl:right-[-45%] 2xl:top-[-60%]"
            >
                <img
                    alt="docs right background"
                    className="relative z-10 rounded-lg opacity-0 shadow-none shadow-black/5 !duration-300 transition-transform-opacity data-[loaded=true]:opacity-100 motion-reduce:transition-none"
                    data-loaded="true" src="/images/docs-right.png"
                />
            </div>
        </React.Fragment>
    );
};
