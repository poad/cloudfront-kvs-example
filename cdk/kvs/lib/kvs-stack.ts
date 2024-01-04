import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

export interface KvsStackProps extends cdk.StackProps {
  name: string;
  comment: string;
}

export class KvsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: KvsStackProps) {
    super(scope, id, props);

    const { name: keyValueStoreName, comment } = props;

    const keyValueStore = new cloudfront.KeyValueStore(this, 'KVS', {
      keyValueStoreName,
      comment,
    });
    keyValueStore.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    new cdk.CfnOutput(this, 'KvsArn', {
      value: keyValueStore.keyValueStoreArn,
    });

    new cdk.CfnOutput(this, 'KvsId', {
      value: keyValueStore.keyValueStoreId,
    });
  }
}
