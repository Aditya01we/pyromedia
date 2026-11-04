'use client';

import { NeonCheckbox } from "./animated-check-box";
import React from 'react';

export default function NeonCheckboxDemo() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="flex flex-col gap-8">
        <div className="flex items-center space-x-2">
          <NeonCheckbox />
          <span className="text-white">Click me</span>
        </div>

        <div className="flex items-center space-x-2">
          <NeonCheckbox label="Accept terms" />
        </div>

        <div className="flex items-center space-x-2">
          <NeonCheckbox defaultChecked label="Already checked" />
        </div>
      </div>
    </div>
  );
}
