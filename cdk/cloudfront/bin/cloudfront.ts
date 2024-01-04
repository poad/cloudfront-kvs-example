#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CloudfrontStack, Config } from '../lib/cloudfront-stack';

const app = new cdk.App();
const keyValueStoreArn = app.node.tryGetContext('kvs-arn') as string;
const keyValueStoreId = app.node.tryGetContext('kvs-id') as string;
const config = app.node.tryGetContext('config') as Config;

new CloudfrontStack(app, 'cloudfront-kvs-example-stack', {
  keyValueStoreArn,
  keyValueStoreId,
  config,
});
