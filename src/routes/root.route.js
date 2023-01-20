import React from 'react'
import { createNavigationContainerRef } from '@react-navigation/native';

export const isMountedRef = React.createRef();
export const navigationRef = React.createRef();


export function navigate(name, params=null) {
    if (isMountedRef.current && navigationRef.current) {
        navigationRef.current.navigate(name, params);
    }
}