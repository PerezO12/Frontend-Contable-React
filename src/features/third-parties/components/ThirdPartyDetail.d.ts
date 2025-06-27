import React from 'react';
import { type ThirdParty } from '../types';
interface ThirdPartyDetailProps {
    thirdParty: ThirdParty;
    onEdit?: () => void;
    onDelete?: () => void;
    loading?: boolean;
}
export declare const ThirdPartyDetail: React.FC<ThirdPartyDetailProps>;
export {};
