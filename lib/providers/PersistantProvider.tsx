"use client"
import { persistor } from '@/app/store';
import React from 'react'
import { PersistGate } from 'redux-persist/integration/react';

const PersistantProvider = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
    return (
        <PersistGate loading={<div>Chargement de la session...</div>} persistor={persistor}>
            {children}
        </PersistGate>
    )
}

export default PersistantProvider;






