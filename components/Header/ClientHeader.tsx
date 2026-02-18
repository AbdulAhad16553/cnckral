"use client";

import { useEffect, useState } from 'react';
import Header from './index';

interface ClientHeaderProps {
    storeData: any;
}

const ClientHeader = ({ storeData }: ClientHeaderProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return <Header storeData={storeData} />;
};

export default ClientHeader;
