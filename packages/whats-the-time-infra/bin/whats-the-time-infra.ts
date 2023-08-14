#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { WhatsTheTimeStack } from "../lib/whats-the-time-stack";

const app = new cdk.App();

new WhatsTheTimeStack(app, "WhatsTheTimeStack", {
  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  env: { account: "738763148775", region: "eu-west-1" },
});
