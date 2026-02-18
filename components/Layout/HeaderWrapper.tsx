"use client";

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

interface HeaderWrapperProps {
    storeData: any;
}

// Dynamically import the header with no SSR to avoid module factory issues
const DynamicHeader = dynamic(
    () => import('./ClientLayout'),
    { ssr: false }
);

const HeaderWrapper = ({ storeData }: HeaderWrapperProps) => {
    return (
        <Suspense fallback={null}>
            <DynamicHeader storeData={storeData} />
        </Suspense>
    );
};

export default HeaderWrapper;
