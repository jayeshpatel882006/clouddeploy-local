import fs from "fs";
import path from "path";

export const generateDeploymentManifest = ({
  appName,
  image,
  containerPort = 3000,
  replicas = 1,
}) => {
  const manifest = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${appName}
spec:
  replicas: ${replicas}
  selector:
    matchLabels:
      app: ${appName}
  template:
    metadata:
      labels:
        app: ${appName}
    spec:
    containers:
        - name: ${appName}
          image: ${image}
          imagePullPolicy: Always
          ports:
            - containerPort: ${containerPort}
`;

  const manifestDir = path.join(process.cwd(), "manifests");

  if (!fs.existsSync(manifestDir)) {
    fs.mkdirSync(manifestDir);
  }

  const filePath = path.join(manifestDir, `${appName}-deployment.yaml`);

  fs.writeFileSync(filePath, manifest);

  return filePath;
};
