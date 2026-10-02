const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let globalCounter = 0;

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.astro')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let localCounter = 0;
    let generatedStyles = [];

    // class="..." style="..."
    content = content.replace(/class="([^"]+)"\s+style="([^"]+)"/g, (match, classes, style) => {
      if (style.includes('${')) return match;
      globalCounter++; localCounter++;
      let className = `ext-style-${globalCounter}`;
      generatedStyles.push(`.${className} { ${style} }`);
      return `class="${classes} ${className}"`;
    });

    // style="..." class="..."
    content = content.replace(/style="([^"]+)"\s+class="([^"]+)"/g, (match, style, classes) => {
      if (style.includes('${')) return match;
      globalCounter++; localCounter++;
      let className = `ext-style-${globalCounter}`;
      generatedStyles.push(`.${className} { ${style} }`);
      return `class="${classes} ${className}"`;
    });

    // just style="..."
    content = content.replace(/style="([^"]+)"/g, (match, style) => {
      if (style.includes('${')) return match;
      globalCounter++; localCounter++;
      let className = `ext-style-${globalCounter}`;
      generatedStyles.push(`.${className} { ${style} }`);
      return `class="${className}"`;
    });

    if (localCounter > 0) {
      let cssText = generatedStyles.join('\n');
      if (content.includes('<style>')) {
        content = content.replace('<style>', `<style>\n${cssText}\n`);
      } else {
        content += `\n<style>\n${cssText}\n</style>\n`;
      }
      fs.writeFileSync(filePath, content);
      console.log(`Extracted ${localCounter} inline styles in ${filePath}`);
    }
  }
});
