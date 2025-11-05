'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type Breadcrumb = {
    title: string;
    url?: string;
};
export type AppPageContext = {
    breadcrumbs: Breadcrumb[];
    setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
};

export const appPageContext = createContext<AppPageContext | null>(null);

export const AppPageProvider = ({
    children,
}: Readonly<{ children: React.ReactNode }>) => {
    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
    return (
        <appPageContext.Provider
            value={{
                breadcrumbs,
                setBreadcrumbs,
            }}
        >
            {children}
        </appPageContext.Provider>
    );
};

export const useAppPageContext = () => {
    const ctx = useContext(appPageContext);
    if (!ctx) {
        throw new Error('useAppPageContext must be used as useAppPageContext');
    }
    return ctx;
};

export const BreadCrumbs = ({
    breadcrumbs,
}: Readonly<{ breadcrumbs: Breadcrumb[] }>) => {
    const { setBreadcrumbs } = useAppPageContext();

    useEffect(() => {
        setBreadcrumbs(breadcrumbs);
    }, [breadcrumbs, setBreadcrumbs]);

    return <>{''}</>;
};
