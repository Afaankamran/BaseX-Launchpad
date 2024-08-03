import { AlertCircle, CheckCircle } from 'react-feather';

import React from 'react';

export default function ContentPopup({
  success,
  summary,
}: {
  success?: boolean;
  summary?: string;
}) {
  return (
    <div className="flex flex-row w-full flex-nowrap" style={{ zIndex: 1000 }}>
      <div className="pr-4">
        {success ? (
          <CheckCircle className="text-2xl text-green" />
        ) : (
          <AlertCircle className="text-2xl text-red" />
        )}
      </div>
      <div className="flex ">
        <div className="font-bold text-white">{summary ?? ''}</div>
      </div>
    </div>
  );
}
