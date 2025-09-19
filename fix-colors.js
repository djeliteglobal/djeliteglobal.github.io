const fs = require('fs');

const filePath = 'C:\\Users\\mgmt\\Documents\\CLI Integrations\\DJ Elite Coaching Funnel 2 Code assist\\src\\components\\FreeCourseAccess.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace all CSS variables with explicit colors
content = content.replace(/text-\[color:var\(--text-primary\)\]/g, 'text-white');
content = content.replace(/text-\[color:var\(--text-secondary\)\]/g, 'text-gray-300');
content = content.replace(/text-\[color:var\(--muted\)\]/g, 'text-gray-400');
content = content.replace(/bg-\[color:var\(--surface\)\]/g, 'bg-gray-800');
content = content.replace(/bg-\[color:var\(--surface-alt\)\]/g, 'bg-gray-700');
content = content.replace(/border-\[color:var\(--border\)\]/g, 'border-gray-700');
content = content.replace(/bg-\[color:var\(--accent\)\]/g, 'bg-green-500');
content = content.replace(/border-\[color:var\(--accent\)\]/g, 'border-green-500');
content = content.replace(/text-\[color:var\(--accent\)\]/g, 'text-green-500');
content = content.replace(/hover:border-\[color:var\(--accent\)\]\/50/g, 'hover:border-green-500/50');
content = content.replace(/bg-\[color:var\(--accent\)\]\/10/g, 'bg-green-500/10');
content = content.replace(/bg-\[color:var\(--accent\)\]\/20/g, 'bg-green-500/20');
content = content.replace(/border-\[color:var\(--accent\)\]\/20/g, 'border-green-500/20');

fs.writeFileSync(filePath, content);
console.log('Fixed all CSS variables');