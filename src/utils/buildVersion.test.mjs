import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatBuildVersion,
  isPlainReleaseVersion,
  parseGitHubOwnerFromRemote,
} from './buildVersion.ts';

test('parseGitHubOwnerFromRemote supports https and ssh remotes', () => {
  assert.equal(
    parseGitHubOwnerFromRemote('https://github.com/LyleLiu666/Cli-Proxy-API-Management-Center.git'),
    'LyleLiu666'
  );
  assert.equal(
    parseGitHubOwnerFromRemote('git@github.com:LyleLiu666/Cli-Proxy-API-Management-Center.git'),
    'LyleLiu666'
  );
});

test('formatBuildVersion annotates plain upstream-style versions for fork builds', () => {
  assert.equal(
    formatBuildVersion({
      rawVersion: 'v1.7.41',
      originRemoteUrl: 'https://github.com/LyleLiu666/Cli-Proxy-API-Management-Center.git',
    }),
    'v1.7.41+fork.lyleliu666'
  );
});

test('formatBuildVersion preserves versions that already carry fork identity', () => {
  assert.equal(
    formatBuildVersion({
      rawVersion: 'v1.7.41-lyleliu666.1',
      originRemoteUrl: 'https://github.com/LyleLiu666/Cli-Proxy-API-Management-Center.git',
    }),
    'v1.7.41-lyleliu666.1'
  );
});

test('formatBuildVersion leaves upstream builds unchanged', () => {
  assert.equal(
    formatBuildVersion({
      rawVersion: 'v1.7.41',
      originRemoteUrl: 'https://github.com/router-for-me/Cli-Proxy-API-Management-Center.git',
    }),
    'v1.7.41'
  );
});

test('isPlainReleaseVersion distinguishes plain upstream tags from fork tags', () => {
  assert.equal(isPlainReleaseVersion('v1.7.41'), true);
  assert.equal(isPlainReleaseVersion('v1.7.41-lyleliu666.1'), false);
});
