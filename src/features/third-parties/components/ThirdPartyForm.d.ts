import React from 'react';
import { type ThirdParty, type ThirdPartyCreate, type ThirdPartyUpdate } from '../types';
interface ThirdPartyFormProps {
    thirdParty?: ThirdParty;
    onSubmit: (data: ThirdPartyCreate | ThirdPartyUpdate) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
    mode: 'create' | 'edit';
}
export declare const ThirdPartyForm: React.FC<ThirdPartyFormProps>;
export {};
