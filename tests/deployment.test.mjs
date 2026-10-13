import test from 'node:test';
import assert from 'node:assert/strict';
import {deploymentSettings,deploymentDocument} from '../scripts/deployment.mjs';
import {renderDocument} from '../src/render.js';

test('Production resolves the real origin, while local builds invent no public domain',()=>{
  assert.deepEqual(deploymentSettings({}),{siteURL:'',noindex:false});
  assert.deepEqual(deploymentSettings({VERCEL_ENV:'production',VERCEL_PROJECT_PRODUCTION_URL:'portfolio.example',VERCEL_URL:'build.example'}),{siteURL:'https://portfolio.example/',noindex:false});
  assert.equal(deploymentSettings({PORTFOLIO_SITE_URL:'https://custom.example',VERCEL_ENV:'production',VERCEL_PROJECT_PRODUCTION_URL:'portfolio.example'}).siteURL,'https://custom.example/');
  for(const url of ['http://example.com','https://user:password@example.com','https://example.com/portfolio','https://example.com/?q=test','https://example.com/#hash','not-a-url'])assert.throws(()=>deploymentSettings({PORTFOLIO_SITE_URL:url}));
});

test('Preview builds stay unindexed even when a production origin is explicitly set',()=>{
  const settings=deploymentSettings({VERCEL_ENV:'preview',VERCEL_URL:'preview.example',PORTFOLIO_SITE_URL:'https://production.example'});
  assert.equal(settings.noindex,true);
  assert.ok(deploymentDocument(renderDocument('en'),'index.html',settings).includes('<meta name="robots" content="noindex, nofollow">'));
});

test('Deep bilingual pages use absolute canonical, alternate and share image URLs',()=>{
  const html=deploymentDocument(renderDocument('en',{page:'case',id:'cih'}),'works/cih/index.html',{siteURL:'https://portfolio.example/',noindex:false});
  assert.ok(html.includes('rel="canonical" href="https://portfolio.example/works/cih/index.html"'));
  assert.ok(html.includes('hreflang="fr" href="https://portfolio.example/fr/works/cih/index.html"'));
  assert.ok(html.includes('content="https://portfolio.example/public/social-preview.png"'));
  assert.ok(!html.includes('noindex'));
});
