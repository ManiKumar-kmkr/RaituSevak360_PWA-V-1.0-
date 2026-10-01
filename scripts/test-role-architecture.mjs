// scripts/test-role-architecture.mjs
// Automated verification script for RaituSevak360 Role Architecture

const API_BASE = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
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

async function runTests() {
  console.log('==================================================');
  console.log('STARTING RAITUSEVAK360 ROLE ARCHITECTURE TESTS');
  console.log('==================================================\n');

  // Test 1: Existing Farmer Login
  console.log('--- TEST 1: Existing Farmer Login ---');
  const farmerLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ mobile: '9999999999', password: 'Demo@123' }),
  });
  assert(farmerLogin.ok, 'Farmer login succeeds');
  assert(farmerLogin.body.user?.role === 'farmer', 'Farmer role is preserved as farmer');
  const farmerToken = farmerLogin.body.token;
  assert(!!farmerToken, 'Farmer received valid JWT token');

  // Test 2: Arbitrary role reassignment through initial endpoint must be rejected
  console.log('\n--- TEST 2: Arbitrary Role Override Prevention ---');
  const overrideAttempt = await request('/auth/role', {
    method: 'POST',
    headers: { Authorization: `Bearer ${farmerToken}` },
    body: JSON.stringify({ role: 'expert' }),
  });
  assert(!overrideAttempt.ok && overrideAttempt.status === 400, 'Existing user cannot overwrite role via /auth/role');

  // Test 3: Farmer -> Seller Switch
  console.log('\n--- TEST 3: Farmer -> Seller Switch ---');
  const switchFarmerToSeller = await request('/auth/switch-role', {
    method: 'POST',
    headers: { Authorization: `Bearer ${farmerToken}` },
    body: JSON.stringify({ role: 'seller' }),
  });
  assert(switchFarmerToSeller.ok, 'Farmer -> Seller switch succeeds');
  assert(switchFarmerToSeller.body.data?.role === 'seller', 'Account role updated to seller');
  const updatedToken = switchFarmerToSeller.body.token || farmerToken;

  // Test 4: Profile Verification & Role Persistence
  console.log('\n--- TEST 4: Persistence Check on Seller Role ---');
  const getSellerProfile = await request('/auth/me', {
    headers: { Authorization: `Bearer ${updatedToken}` },
  });
  assert(getSellerProfile.ok, 'Fetch /auth/me profile succeeds');
  assert(getSellerProfile.body.data?.role === 'seller', 'Role persisted as seller');

  // Test 5: Seller -> Farmer Switch
  console.log('\n--- TEST 5: Seller -> Farmer Switch ---');
  const switchSellerToFarmer = await request('/auth/switch-role', {
    method: 'POST',
    headers: { Authorization: `Bearer ${updatedToken}` },
    body: JSON.stringify({ role: 'farmer' }),
  });
  assert(switchSellerToFarmer.ok, 'Seller -> Farmer switch succeeds');
  assert(switchSellerToFarmer.body.data?.role === 'farmer', 'Account role reverted to farmer');

  // Test 6: Disallowed Role Switches from Farmer
  console.log('\n--- TEST 6: Disallowed Role Switches (Farmer -> Expert / Student / Government) ---');
  for (const invalidRole of ['expert', 'student', 'government']) {
    const invalidSwitch = await request('/auth/switch-role', {
      method: 'POST',
      headers: { Authorization: `Bearer ${switchSellerToFarmer.body.token || farmerToken}` },
      body: JSON.stringify({ role: invalidRole }),
    });
    assert(!invalidSwitch.ok && invalidSwitch.status === 400, `Farmer -> ${invalidRole} is rejected`);
  }

  // Test 7: Fixed Role - Expert
  console.log('\n--- TEST 7: Fixed Role: Expert ---');
  const expertLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ mobile: '7777777777', password: 'Demo@123' }),
  });
  assert(expertLogin.ok, 'Expert login succeeds');
  assert(expertLogin.body.user?.role === 'expert', 'Expert has role expert');
  const expertSwitchAttempt = await request('/auth/switch-role', {
    method: 'POST',
    headers: { Authorization: `Bearer ${expertLogin.body.token}` },
    body: JSON.stringify({ role: 'farmer' }),
  });
  assert(!expertSwitchAttempt.ok && expertSwitchAttempt.status === 400, 'Expert cannot switch to farmer');

  // Test 8: Fixed Role - Student
  console.log('\n--- TEST 8: Fixed Role: Student ---');
  const studentLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ mobile: '6666666666', password: 'Demo@123' }),
  });
  assert(studentLogin.ok, 'Student login succeeds');
  assert(studentLogin.body.user?.role === 'student', 'Student has role student');
  const studentSwitchAttempt = await request('/auth/switch-role', {
    method: 'POST',
    headers: { Authorization: `Bearer ${studentLogin.body.token}` },
    body: JSON.stringify({ role: 'seller' }),
  });
  assert(!studentSwitchAttempt.ok && studentSwitchAttempt.status === 400, 'Student cannot switch to seller');

  // Test 9: Fixed Role - Government
  console.log('\n--- TEST 9: Fixed Role: Government ---');
  const govtLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ mobile: '5555555555', password: 'Demo@123' }),
  });
  assert(govtLogin.ok, 'Government login succeeds');
  assert(govtLogin.body.user?.role === 'government', 'Government has role government');
  const govtSwitchAttempt = await request('/auth/switch-role', {
    method: 'POST',
    headers: { Authorization: `Bearer ${govtLogin.body.token}` },
    body: JSON.stringify({ role: 'farmer' }),
  });
  assert(!govtSwitchAttempt.ok && govtSwitchAttempt.status === 400, 'Government cannot switch to farmer');

  // Test 10: Completely New Account Flow
  console.log('\n--- TEST 10: Completely New Account Flow ---');
  const randomMobile = `91${Math.floor(10000000 + Math.random() * 90000000)}`;
  console.log(`Registering brand new user: ${randomMobile}`);

  const registerRes = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Ramesh Patel',
      mobile: randomMobile,
      password: 'Password@123',
    }),
  });
  assert(registerRes.ok, 'New user registration succeeds');
  assert(registerRes.body.user?.role === undefined || registerRes.body.user?.role === null, 'New user has NO role assigned yet (role is unassigned)');

  // Verify OTP
  const verifyRes = await request('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({
      mobile: randomMobile,
      otp: '538123', // preview OTP accepted in dev
      purpose: 'register',
    }),
  });
  assert(verifyRes.ok, 'New user OTP verification succeeds');
  assert(verifyRes.body.user?.role === undefined || verifyRes.body.user?.role === null, 'After OTP, new user role is still null/unassigned (directs to /role-selection)');
  const newUserToken = verifyRes.body.token;

  // First Role Selection
  console.log('\n--- TEST 11: First Role Selection for New Account ---');
  const assignRoleRes = await request('/auth/role', {
    method: 'POST',
    headers: { Authorization: `Bearer ${newUserToken}` },
    body: JSON.stringify({ role: 'farmer' }),
  });
  assert(assignRoleRes.ok, 'Initial role selection saved to account as farmer');
  assert(assignRoleRes.body.data?.role === 'farmer', 'Account role is now farmer');

  // Subsequent Login of New User: Must NOT require role selection again!
  console.log('\n--- TEST 12: Subsequent Login of Account with Saved Role ---');
  const subsequentLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ mobile: randomMobile, password: 'Password@123' }),
  });
  assert(subsequentLogin.ok, 'Subsequent login succeeds');
  assert(subsequentLogin.body.user?.role === 'farmer', 'Subsequent login returns saved role farmer (directs to /dashboard, NO role selection)');

  console.log('\n==================================================');
  console.log('🎉 ALL RAITUSEVAK360 ROLE ARCHITECTURE TESTS PASSED!');
  console.log('==================================================');
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
