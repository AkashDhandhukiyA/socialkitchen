const fs = require('fs');
const path = require('path');

let content = fs.readFileSync('src/pages/index.astro', 'utf8');
let counter = 0;
let generatedStyles = [];

// This will match class="..." style="..."
content = content.replace(/class="([^"]+)"\s+style="([^"]+)"/g, (match, classes, style) => {
  if (style.includes('${')) return match;
  counter++;
  let className = `ext-style-${counter}`;
  generatedStyles.push(`.${className} { ${style} }`);
  return `class="${classes} ${className}"`;
});

// Match style="..." class="..."
content = content.replace(/style="([^"]+)"\s+class="([^"]+)"/g, (match, style, classes) => {
  if (style.includes('${')) return match;
  counter++;
  let className = `ext-style-${counter}`;
  generatedStyles.push(`.${className} { ${style} }`);
  return `class="${classes} ${className}"`;
});

// Match just style="..."
content = content.replace(/style="([^"]+)"/g, (match, style) => {
  if (style.includes('${')) return match;
  counter++;
  let className = `ext-style-${counter}`;
  generatedStyles.push(`.${className} { ${style} }`);
  return `class="${className}"`;
});

if (generatedStyles.length > 0) {
  let cssText = generatedStyles.join('\n');
  if (content.includes('<style>')) {
    content = content.replace('<style>', `<style>\n${cssText}\n`);
  } else {
    content += `\n<style>\n${cssText}\n</style>\n`;
  }
  fs.writeFileSync('src/pages/index.astro', content);
  console.log(`Extracted ${counter} inline styles.`);
} else {
  console.log('No inline styles found.');
}
