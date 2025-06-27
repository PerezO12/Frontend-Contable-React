import React from 'react';
import { ThirdPartyListEnhanced } from '../components/ThirdPartyListEnhanced';
import { useNavigate } from 'react-router-dom';
export var ThirdPartyListPage = function () {
    var navigate = useNavigate();
    var handleThirdPartySelect = function (thirdParty) {
        navigate("/third-parties/".concat(thirdParty.id));
    };
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ThirdPartyListEnhanced onThirdPartySelect={handleThirdPartySelect}/>
    </div>);
};
