const fs = require('fs');

let content = fs.readFileSync('src/components/Footer.astro', 'utf8');

content = content.replace(/{ href: '\/#home',    label: 'Home' }/, "{ href: '/',    label: 'Home' }");
content = content.replace(/href="tel:\+91XXXXXXXXXX" class="ext-style-45">\+91-XXXXXXXXXX<\/a>/, 'href="tel:+917567640841" class="ext-style-45">+91 75676 40841</a>');
content = content.replace(/<Icon name={s.icon} size={18} \/>/g, '<span style="display:none;">{s.label}</span>\n            <Icon name={s.icon} size={18} />');
content = content.replace(/<a href="#">Privacy Policy<\/a>/, '<a href="/privacy-policy">Privacy Policy</a>');
content = content.replace(/<a href="#">Terms of Service<\/a>/, '<a href="/terms-of-service">Terms of Service</a>');

fs.writeFileSync('src/components/Footer.astro', content);
