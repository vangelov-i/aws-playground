import { SubnetType, Vpc, IpAddresses } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export default class MyVpc extends Vpc {
  constructor(scope: Construct) {
    super(scope, "My-CDK-VPC", {
      maxAzs: 1,
      natGateways: 0,

      ipAddresses: IpAddresses.cidr("10.0.0.0/27"),
      subnetConfiguration: [
        {
          name: "Public",
          subnetType: SubnetType.PUBLIC,
        },
        {
          name: "Private",
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });
  }
}
