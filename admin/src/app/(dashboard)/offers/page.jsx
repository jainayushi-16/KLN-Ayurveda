'use client';

import React from 'react';
import { Tag } from 'lucide-react';

/*
  OFFERS & DISCOUNTS MANAGEMENT MODULE (COMMENTED / DISABLED)

  To re-enable this module:
  1. Uncomment the full implementation below or restore from version control.
  2. Uncomment router.use("/offers", offerRoutes) in backend routes.
  3. Uncomment the sidebar link in Sidebar.jsx.
*/

export default function OffersPage() {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <div className="p-4 rounded-3xl bg-gray-100 text-gray-400">
        <Tag className="w-10 h-10" />
      </div>
      <h2 className="text-xl font-black text-gray-700">Offers & Discounts Module Disabled</h2>
      <p className="text-xs text-gray-500 max-w-md">
        This module has been temporarily commented out as per admin configuration.
      </p>
    </div>
  );
}
