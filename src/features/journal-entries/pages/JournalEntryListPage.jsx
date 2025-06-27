import React from 'react';
import { useNavigate } from 'react-router-dom';
import { JournalEntryList } from '../components';
export var JournalEntryListPage = function () {
    var navigate = useNavigate();
    var handleEntrySelect = function (entry) {
        navigate("/journal-entries/".concat(entry.id));
    };
    var handleCreateEntry = function () {
        navigate('/journal-entries/new');
    };
    return (<>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Asientos Contables</h1>
        <p className="text-gray-600 mt-2">
          Gestión completa de asientos contables y partida doble
        </p>
      </div>      <JournalEntryList onEntrySelect={handleEntrySelect} onCreateEntry={handleCreateEntry}/>
    </>);
};
