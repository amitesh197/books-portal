import React from 'react';

function TotalsSummary({totals}) {
    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours}h ${minutes}m ${remainingSeconds}s`;
    };

    return (
        <div className="px-5 py-2">
            <h2 className="text-xl font-bold mb-2">Call Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                    <p className="font-semibold">Total Calls:</p>
                    <p>{totals.total_calls}</p>
                </div>
                <div>
                    <p className="font-semibold">Total Duration:</p>
                    <p>{formatDuration(totals.duration)}</p>
                </div>
                <div>
                    <p className="font-semibold">Outgoing Calls Answered:</p>
                    <p>{totals.oc_answered}</p>
                </div>
                <div>
                    <p className="font-semibold">Outgoing Calls Missed:</p>
                    <p>{totals.oc_missed}</p>
                </div>
                <div>
                    <p className="font-semibold">Incoming Calls Answered:</p>
                    <p>{totals.ic_answered}</p>
                </div>
                <div>
                    <p className="font-semibold">Incoming Calls Missed:</p>
                    <p>{totals.ic_missed}</p>
                </div>
                <div>
                    <p className="font-semibold">Total agents working:</p>
                    <p>{totals.agent_count}</p>
                </div>
            </div>
        </div>);
}

export default TotalsSummary;