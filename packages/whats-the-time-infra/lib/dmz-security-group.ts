import { IVpc, Peer, Port, SecurityGroup } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export default class DMZSecurityGroup extends SecurityGroup {
  constructor(scope: Construct, { vpc }: { vpc: IVpc }) {
    super(scope, "My-DMZ-SG", {
      vpc,
      allowAllOutbound: true,
      description:
        "Allow ports in: SSH (TCP 22), HTTP (TCP 80), HTTPS (TCP 443)",
    });

    this.addIngressRule(Peer.anyIpv4(), Port.tcp(22), "Allow SSH Access");
    this.addIngressRule(Peer.anyIpv4(), Port.tcp(80), "Allow HTTP Access");
    this.addIngressRule(Peer.anyIpv4(), Port.tcp(443), "Allow HTTPS Access");
  }
}
