#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { KvsStack } from '../lib/kvs-stack.js';

const app = new cdk.App();
new KvsStack(app, 'cloudfront-kvs-example-kvs-stack', {
  name: 'kvs-example',
  comment: 'example',
});
