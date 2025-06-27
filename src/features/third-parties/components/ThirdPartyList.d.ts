import React from 'react';
import { type ThirdParty, type ThirdPartyFilters } from '../types';
interface ThirdPartyListProps {
    onThirdPartySelect?: (thirdParty: ThirdParty) => void;
    onCreateThirdParty?: () => void;
    initialFilters?: ThirdPartyFilters;
    showActions?: boolean;
}
export declare const ThirdPartyList: React.FC<ThirdPartyListProps>;
export {};
