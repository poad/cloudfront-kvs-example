#!/usr/bin/env node
import { KvsStack } from '../lib/kvs-stack.js';
import * as cdk from 'aws-cdk-lib';

const app = new cdk.App();
new KvsStack(app, 'CloudfrontKvsExampleKvs', {
  name: 'kvs-example',
  comment: 'example',
});
