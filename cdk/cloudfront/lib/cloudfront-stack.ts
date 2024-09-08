import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { compileBundles } from './process/setup';

export interface Config {
  bucketName: string;
  cloudfront: {
    comment: string;
    originAccessControl: {
      functionConfig: {
        name: string;
        arn?: string;
      };
      name: string;
    };
  };
}

interface CloudfrontStackProps extends cdk.StackProps {
  keyValueStoreArn: string;
  keyValueStoreId: string;
  environment?: string;
  config: Config;
}

export class CloudfrontStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CloudfrontStackProps) {
    super(scope, id, props);

    const {
      environment,
      keyValueStoreArn,
      keyValueStoreId: kvsId,
      config: {
        cloudfront: { comment, originAccessControl: oacConfig },
        bucketName,
      },
    } = props;

    const s3bucket = new s3.Bucket(this, 'S3Bucket', {
      bucketName,
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      accessControl: s3.BucketAccessControl.PRIVATE,
      publicReadAccess: false,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    compileBundles({ kvsId });

    // CloudFront Functionリソースの定義
    const { functionConfig } = oacConfig;
    const functionName = environment
      ? `${environment}-${functionConfig.name}`
      : functionConfig.name;
    const fn = new cloudfront.Function(this, 'WebsiteIndexPageForwardFunction', {
          functionName,
          code: cloudfront.FunctionCode.fromFile({
            filePath: 'function/index.js',
          }),
          runtime: cloudfront.FunctionRuntime.JS_2_0,
        });
    (
      fn.node
        .defaultChild as cdk.aws_cloudfront.CfnFunction
    ).addPropertyOverride('FunctionConfig.KeyValueStoreAssociations', [
      { KeyValueStoreARN: keyValueStoreArn },
    ]);
    (
      fn.node
        .defaultChild as cdk.aws_cloudfront.CfnFunction
    ).addPropertyOverride('AutoPublish', 'true');

    const functionAssociations = [
      {
        eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
        function: fn,
      },
    ];

    const originAccessControl = new cloudfront.S3OriginAccessControl(
      this,
      'OriginAccessControl',
      {
        originAccessControlName: oacConfig.functionConfig.name,
        signing: cloudfront.Signing.SIGV4_NO_OVERRIDE,
      },
    );

    const cf = new cloudfront.Distribution(this, 'CloudFront', {
      comment,
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(s3bucket,
          {
            originAccessControl,
          }
        ),
        compress: true,
        functionAssociations,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
        viewerProtocolPolicy:
          cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
    });
    s3bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        sid: 'AllowCloudFrontServicePrincipalReadOnly',
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
        actions: ['s3:GetObject'],
        resources: [`${s3bucket.bucketArn}/*`],
        conditions: {
          StringEquals: {
            'AWS:SourceArn': `arn:aws:cloudfront::${this.account}:distribution/${cf.distributionId}`,
          },
        },
      }),
    );

    // eslint-disable-next-line no-new
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset(`${process.cwd()}/../../app/dist`)],
      destinationBucket: s3bucket,
      destinationKeyPrefix: '/',
      exclude: ['.DS_Store', '*/.DS_Store'],
    });

    // eslint-disable-next-line no-new
    new cdk.CfnOutput(this, 'AccessURLOutput', {
      value: `https://${cf.distributionDomainName}`,
    });
  }
}
