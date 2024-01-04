#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { KvsStack } from '../lib/kvs-stack';

const app = new cdk.App();
new KvsStack(app, 'cloudfront-kvs-example-kvs-stack', {
  name: 'kvs-example',
  comment: 'example',
});
