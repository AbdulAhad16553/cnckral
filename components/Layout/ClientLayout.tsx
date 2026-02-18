"use client";

import { useEffect, useState } from 'react';
import ClientHeader from '../Header/ClientHeader';

interface ClientLayoutProps {
    storeData: any;
}

const ClientLayout = ({ storeData }: ClientLayoutProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    return <ClientHeader storeData={storeData} />;
};

export default ClientLayout;
