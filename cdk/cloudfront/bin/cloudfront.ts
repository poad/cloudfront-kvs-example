#!/usr/bin/env node
import { CloudfrontStack, Config } from '../lib/cloudfront-stack.js';
import * as cdk from 'aws-cdk-lib';

const app = new cdk.App();
const keyValueStoreArn = app.node.tryGetContext('kvs-arn') as string;
const keyValueStoreId = app.node.tryGetContext('kvs-id') as string;
const config = app.node.tryGetContext('config') as Config;

new CloudfrontStack(app, 'CloudfrontKvsExample', {
  keyValueStoreArn,
  keyValueStoreId,
  config,
});
