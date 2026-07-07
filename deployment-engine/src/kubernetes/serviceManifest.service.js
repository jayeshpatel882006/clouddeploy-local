import fs from "fs";
import path from "path";

export const generateServiceManifest = ({
  appName,
  containerPort = 3000,
  servicePort = 80,
}) => {
  const manifest = `apiVersion: v1
kind: Service
metadata:
  name: ${appName}
spec:
  selector:
    app: ${appName}
  type: NodePort
  ports:
    - protocol: TCP
      port: ${servicePort}
      targetPort: ${containerPort}
`;

  const manifestDir = path.join(process.cwd(), "manifests");

  if (!fs.existsSync(manifestDir)) {
    fs.mkdirSync(manifestDir);
  }

  const filePath = path.join(manifestDir, `${appName}-service.yaml`);

  fs.writeFileSync(filePath, manifest);

  return {
    path: filePath,
  };
};
