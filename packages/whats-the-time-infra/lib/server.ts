import { Instance, CfnEIP, CfnEIPAssociation } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import MyVpc from "./vpc";
import { KeyPair } from "cdk-ec2-key-pair";
import { CfnOutput } from "aws-cdk-lib";
import DMZSecurityGroup from "./dmz-security-group";
import MyEC2DockerInstance from "./docker-ec2";

export class ServerResources extends Construct {
  public instance: Instance;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new MyVpc(this);
    const securityGroup = new DMZSecurityGroup(this, { vpc });

    const key = new KeyPair(this, "KeyPair", {
      name: "cdk-keypair",
      description: "Key Pair created with CDK Deployment",
    });

    this.instance = new MyEC2DockerInstance(this, {
      vpc,
      subnets: vpc.publicSubnets,
      securityGroup,
      keyName: key.keyPairName,
    });

    const elasticIp = new CfnEIP(this, "MyElasticIp");
    new CfnEIPAssociation(this, "Ec2Association", {
      eip: elasticIp.ref,
      instanceId: this.instance.instanceId,
    });

    new CfnOutput(this, "EC2 IP Address", {
      value: this.instance.instancePublicIp,
    });

    new CfnOutput(this, "Key Name", { value: key.keyPairName });
    new CfnOutput(this, "Download Key Command", {
      value: `aws secretsmanager get-secret-value --secret-id ec2-ssh-key/${key.keyPairName}/private --query SecretString --output text > cdk-key.pem && chmod 400 cdk-key.pem`,
    });

    new CfnOutput(this, "ssh command to instancePublicIp", {
      value: `ssh -i cdk-key.pem -o IdentitiesOnly=yes ec2-user@${this.instance.instancePublicIp}`,
    });
  }
}
