#!/usr/bin/env node
/**
 * Quick verification that analytics APIs work.
 * Run with: node scripts/verify-analytics.js
 * Requires the app to be running at http://localhost:3000
 */

const BASE = process.env.BASE_URL || 'http://localhost:3000';

async function main() {
  console.log('Verifying analytics...\n');

  // 1. Record a page view
  try {
    const postRes = await fetch(`${BASE}/api/analytics/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/en' }),
    });
    const postData = await postRes.json();
    if (postRes.ok && postData.ok) {
      console.log('✓ POST /api/analytics/view – recorded a view');
    } else {
      console.log('✗ POST /api/analytics/view –', postRes.status, postData);
    }
  } catch (e) {
    console.log('✗ POST /api/analytics/view –', e.message);
  }

  // 2. Get dashboard stats (should include pageViews)
  try {
    const getRes = await fetch(`${BASE}/api/dashboard/stats`);
    const stats = await getRes.json();
    if (getRes.ok && typeof stats.pageViews === 'number') {
      console.log('✓ GET /api/dashboard/stats –', { services: stats.services, media: stats.media, pageViews: stats.pageViews });
    } else {
      console.log('✗ GET /api/dashboard/stats –', getRes.status, stats);
    }
  } catch (e) {
    console.log('✗ GET /api/dashboard/stats –', e.message);
  }

  console.log('\nDone. If both show ✓, analytics is working.');
}

main();
