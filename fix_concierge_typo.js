const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/sections/ConciergeBand.tsx');
const content = fs.readFileSync(filePath, 'utf8');

const oldStr = 'text-[11px]';
const newStr = 'text-xs';

if (content.includes(oldStr)) {
  const updatedContent = content.replace(oldStr, newStr);
  fs.writeFileSync(filePath, updatedContent);
  console.log('SUCCESS: Replaced text-[11px] with text-xs');
} else {
  console.log('ABORT: text-[11px] not found in file');
}
