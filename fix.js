const fs = require('fs');
let content = fs.readFileSync('src/app/admin/dashboard/page.tsx', 'utf8');

// Change root backgrounds
content = content.replace(/bg-gradient-to-br from-gray-900 via-\[\#0a0a1a\] to-blue-900\/20/g, 'bg-gray-50');
content = content.replace(/bg-gray-900\/50/g, 'bg-white');
content = content.replace(/bg-\[\#0a0a0a\]/g, 'bg-gray-50');
content = content.replace(/bg-gray-900/g, 'bg-gray-50');
content = content.replace(/bg-gray-800/g, 'bg-white');

// Change borders
content = content.replace(/border-gray-800/g, 'border-gray-200');
content = content.replace(/border-gray-700/g, 'border-gray-200');

// Change texts
content = content.replace(/text-white/g, 'text-gray-900');
content = content.replace(/text-gray-100/g, 'text-gray-900');
content = content.replace(/text-gray-300/g, 'text-gray-700');
content = content.replace(/text-gray-400/g, 'text-gray-500');

// Hovers
content = content.replace(/hover:bg-gray-700/g, 'hover:bg-gray-50');
content = content.replace(/hover:text-white/g, 'hover:text-orange-600');

// Re-fix specific buttons and badges that were broken by text-white replacement
content = content.replace(/bg-orange-600 text-gray-900/g, 'bg-orange-600 text-white');
content = content.replace(/bg-orange-500 text-gray-900/g, 'bg-orange-500 text-white');
content = content.replace(/bg-red-600 text-gray-900/g, 'bg-red-600 text-white');
content = content.replace(/bg-red-500 text-gray-900/g, 'bg-red-500 text-white');
content = content.replace(/bg-green-600 text-gray-900/g, 'bg-green-600 text-white');
content = content.replace(/bg-blue-600 text-gray-900/g, 'bg-blue-600 text-white');
content = content.replace(/text-gray-900 text-\[10px\]/g, 'text-white text-[10px]');
content = content.replace(/border-b-2 border-orange-500 text-gray-900/g, 'border-b-2 border-orange-500 text-orange-600');
content = content.replace(/border-l-4 border-red-500 text-gray-900/g, 'border-l-4 border-orange-500 text-orange-600');

fs.writeFileSync('src/app/admin/dashboard/page.tsx', content);
console.log('Fixed admin dashboard theme');
