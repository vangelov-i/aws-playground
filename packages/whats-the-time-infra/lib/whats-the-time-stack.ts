import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

import { ServerResources } from "./server";

export class WhatsTheTimeStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new ServerResources(this, "Server-Resources");
  }
}
