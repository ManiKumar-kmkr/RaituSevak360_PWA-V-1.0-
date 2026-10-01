const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  for (const f of fs.readdirSync(dir)) {
    if (f === 'node_modules' || f === '.next') continue;
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      results = results.concat(walk(full));
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      results.push(full);
    }
  }
  return results;
}

const existingRoutes = new Set([
  '/',
  '/splash',
  '/about',
  '/contact',
  '/services',
  '/language-selection',
  '/welcome',
  '/login',
  '/register',
  '/verify-otp',
  '/forgot-password',
  '/role-selection',
  '/dashboard',
  '/dashboard/crops',
  '/dashboard/weather',
  '/dashboard/soil',
  '/dashboard/farm',
  '/dashboard/machinery',
  '/dashboard/labour',
  '/dashboard/marketplace',
  '/dashboard/orders',
  '/dashboard/consultations',
  '/dashboard/learning',
  '/dashboard/resources',
  '/dashboard/schemes',
  '/dashboard/reports',
  '/dashboard/ai-advisor',
  '/dashboard/notifications',
  '/dashboard/profile',
  '/dashboard/settings',
]);

const files = walk('frontend');
const findings = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    // Check href
    const hrefMatches = line.matchAll(/href=["']([^"']+)["']/g);
    for (const match of hrefMatches) {
      const target = match[1];
      findings.push({
        file: file.replace(/\\/g, '/'),
        line: idx + 1,
        type: 'href',
        target,
        exists: existingRoutes.has(target) || target.startsWith('tel:') || target.startsWith('mailto:') || target.startsWith('http'),
        raw: line.trim()
      });
    }

    // Check router.push or router.replace
    const pushMatches = line.matchAll(/router\.(push|replace)\(["']([^"']+)["']/g);
    for (const match of pushMatches) {
      const action = match[1];
      const target = match[2];
      findings.push({
        file: file.replace(/\\/g, '/'),
        line: idx + 1,
        type: `router.${action}`,
        target,
        exists: existingRoutes.has(target),
        raw: line.trim()
      });
    }

    // Check window.location
    const locMatches = line.matchAll(/window\.location(?:\.href)?\s*=\s*["']([^"']+)["']/g);
    for (const match of locMatches) {
      const target = match[1];
      findings.push({
        file: file.replace(/\\/g, '/'),
        line: idx + 1,
        type: 'window.location',
        target,
        exists: existingRoutes.has(target),
        raw: line.trim()
      });
    }
  });
}

console.log(JSON.stringify(findings, null, 2));
