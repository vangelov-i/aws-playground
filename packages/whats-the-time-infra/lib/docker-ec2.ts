import {
  Instance,
  InstanceClass,
  InstanceProps,
  InstanceSize,
  InstanceType,
  MachineImage,
  UserData,
  ISubnet,
} from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

interface MyDockerEC2Props
  extends Pick<InstanceProps, "vpc" | "securityGroup" | "keyName"> {
  subnets: ISubnet[];
}

const userData = UserData.custom(`#!/bin/bash

sudo su

sudo dnf update
sudo dnf install docker -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user
newgrp docker

docker run -p 80:3000 -t ivangelov/playground:1

cd /etc/cloud/cloud.cfg.d
rm cloud-config.cfg
touch cloud-config.cfg

echo "" > cloud-config.cfg
echo "#cloud-config" >> cloud-config.cfg
echo "cloud_final_modules:" >> cloud-config.cfg
echo "- [scripts-user, always]" >> cloud-config.cfg
`);

export default class MyEC2DockerInstance extends Instance {
  constructor(
    scope: Construct,
    { vpc, subnets, securityGroup, keyName }: MyDockerEC2Props
  ) {
    super(scope, "My-Web-Server", {
      machineImage: MachineImage.latestAmazonLinux2023(),
      instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
      vpc,
      vpcSubnets: {
        subnets,
      },
      securityGroup,
      keyName,
      userData,
    });
  }
}
