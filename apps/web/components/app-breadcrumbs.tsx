'use client';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useAppPageContext } from '@/components/app-page-context';
import React from 'react';

export default function AppBreadcrumbs() {
    const { breadcrumbs } = useAppPageContext();
    const components = [
        {
            title: 'Home',
            url: '/',
        },
        ...breadcrumbs,
    ].map((bc) => (
        <BreadcrumbItem>
            <BreadcrumbLink href={bc.url}>{bc.title}</BreadcrumbLink>
        </BreadcrumbItem>
    ));

    // Add a separator between each breadcrumb
    const separator = <BreadcrumbSeparator />;
    const componentList = components.flatMap((component, index) => [
        component,
        index < components.length - 1 ? separator : null,
    ]);

    // Add keys to each component for React.cloneElement
    componentList.forEach((component, index) => {
        if (React.isValidElement(component)) {
            componentList[index] = React.cloneElement(component, {
                key: index,
            });
        }
    });

    return (
        <Breadcrumb>
            <BreadcrumbList>{componentList}</BreadcrumbList>
        </Breadcrumb>
    );
}
