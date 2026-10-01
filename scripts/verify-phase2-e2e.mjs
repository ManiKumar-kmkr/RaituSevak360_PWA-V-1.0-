// scripts/verify-phase2-e2e.mjs
// End-to-end verification script for Phase 2 implementation

const FRONTEND_BASE = 'http://localhost:3000';
const BACKEND_BASE = 'http://localhost:5000/api';

async function fetchRoute(path) {
  const res = await fetch(`${FRONTEND_BASE}${path}`);
  return { status: res.status, ok: res.ok };
}

async function apiRequest(endpoint, options = {}) {
  const url = `${BACKEND_BASE}${endpoint}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(url, { ...options, headers });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, body };
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

async function run() {
  console.log('==================================================');
  console.log('PHASE 2 COMPREHENSIVE E2E VERIFICATION');
  console.log('==================================================\n');

  // 1. Verify all routes return HTTP 200
  console.log('--- 1. Testing Route Health on Frontend Server ---');
  const routesToTest = [
    '/dashboard',
    '/dashboard/labour',
    '/dashboard/marketplace',
    '/dashboard/orders',
    '/dashboard/notifications',
    '/dashboard/profile',
    '/dashboard/settings',
    '/dashboard/ai-advisor',
    '/dashboard/consultations',
    '/dashboard/learning',
    '/dashboard/resources',
    '/dashboard/schemes',
    '/dashboard/reports',
    '/dashboard/crops',
    '/dashboard/weather',
    '/dashboard/soil',
    '/dashboard/farm',
    '/dashboard/machinery',
    '/login',
    '/register',
    '/verify-otp',
    '/role-selection',
    '/welcome',
    '/language-selection',
  ];

  for (const route of routesToTest) {
    const res = await fetchRoute(route);
    assert(res.ok && res.status === 200, `Route ${route} responds with HTTP 200`);
  }

  // 2. Verify Centralized Navigation Structure
  console.log('\n--- 2. Verifying Centralized Role Navigation Rules ---');
  const { navigationConfig, getNavigationForRole } = await import('../frontend/config/navigation.ts');

  // Farmer Navigation Check
  const farmerNav = getNavigationForRole('farmer');
  const farmerIds = farmerNav.map((i) => i.id);
  assert(
    JSON.stringify(farmerIds) === JSON.stringify(['home', 'labour', 'marketplace', 'notifications', 'profile']),
    'Farmer navigation is strictly: Home | Labour | Marketplace | Notifications | Profile'
  );
  assert(!farmerIds.includes('ai-advisor'), 'AI Advisor is NOT in Farmer bottom navigation');
  assert(farmerIds.includes('labour'), 'Labour IS present in Farmer bottom navigation');

  // Seller Navigation Check
  const sellerNav = getNavigationForRole('seller');
  const sellerIds = sellerNav.map((i) => i.id);
  assert(
    JSON.stringify(sellerIds) === JSON.stringify(['home', 'marketplace', 'orders', 'notifications', 'profile']),
    'Seller navigation is strictly: Home | Marketplace | Orders | Notifications | Profile'
  );
  assert(!sellerIds.includes('products'), 'Products is NOT in Seller bottom navigation');
  assert(sellerIds.includes('notifications'), 'Notifications IS present in Seller bottom navigation');

  // Expert Navigation Check
  const expertNav = getNavigationForRole('expert');
  const expertIds = expertNav.map((i) => i.id);
  assert(
    JSON.stringify(expertIds) === JSON.stringify(['home', 'advisory', 'consultations', 'notifications', 'profile']),
    'Expert navigation is strictly: Home | Advisory | Consultations | Notifications | Profile'
  );

  // Student Navigation Check
  const studentNav = getNavigationForRole('student');
  const studentIds = studentNav.map((i) => i.id);
  assert(
    JSON.stringify(studentIds) === JSON.stringify(['home', 'learning', 'resources', 'notifications', 'profile']),
    'Student navigation is strictly: Home | Learning | Resources | Notifications | Profile'
  );

  // Government Navigation Check
  const govtNav = getNavigationForRole('government');
  const govtIds = govtNav.map((i) => i.id);
  assert(
    JSON.stringify(govtIds) === JSON.stringify(['home', 'schemes', 'reports', 'notifications', 'profile']),
    'Government navigation is strictly: Home | Schemes | Reports | Notifications | Profile'
  );

  // Notifications for every role
  for (const role of ['farmer', 'seller', 'expert', 'student', 'government']) {
    const nav = getNavigationForRole(role);
    assert(nav.some((i) => i.id === 'notifications'), `Role [${role}] has Notifications in navigation`);
    assert(nav.some((i) => i.id === 'profile'), `Role [${role}] has Profile in navigation`);
  }

  // 3. Backend Role Switching Verification
  console.log('\n--- 3. Verifying Backend Role Switching & Permissions ---');
  // Login as Farmer
  const farmerLogin = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ mobile: '9999999999', password: 'Demo@123' }),
  });
  assert(farmerLogin.ok, 'Farmer login via API succeeds');
  const token = farmerLogin.body.token;

  // Switch Farmer -> Seller
  const switchToSeller = await apiRequest('/auth/switch-role', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ role: 'seller' }),
  });
  assert(switchToSeller.ok, 'Farmer -> Seller switch succeeds');
  assert(switchToSeller.body.data?.role === 'seller', 'Profile role updated to seller');

  // Switch Seller -> Farmer
  const switchToFarmer = await apiRequest('/auth/switch-role', {
    method: 'POST',
    headers: { Authorization: `Bearer ${switchToSeller.body.token || token}` },
    body: JSON.stringify({ role: 'farmer' }),
  });
  assert(switchToFarmer.ok, 'Seller -> Farmer switch succeeds');
  assert(switchToFarmer.body.data?.role === 'farmer', 'Profile role reverted to farmer');

  // Verify Disallowed Switch
  const disallowedSwitch = await apiRequest('/auth/switch-role', {
    method: 'POST',
    headers: { Authorization: `Bearer ${switchToFarmer.body.token || token}` },
    body: JSON.stringify({ role: 'expert' }),
  });
  assert(!disallowedSwitch.ok && disallowedSwitch.status === 400, 'Farmer -> Expert switch is blocked with 400');

  console.log('\n==================================================');
  console.log('🎉 ALL PHASE 2 VERIFICATIONS PASSED SUCCESSFULLY!');
  console.log('==================================================');
}

run().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
