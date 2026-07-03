const generateDeploymentManifest = (deployment) => {
  return {
    apiVersion: "apps/v1",

    kind: "Deployment",

    metadata: {
      name: deployment.applicationName,

      namespace: deployment.namespace || "default",

      labels: {
        app: deployment.applicationName,
      },
    },

    spec: {
      replicas: deployment.replicas,

      selector: {
        matchLabels: {
          app: deployment.applicationName,
        },
      },

      template: {
        metadata: {
          labels: {
            app: deployment.applicationName,
          },
        },

        spec: {
          containers: [
            {
              name: deployment.applicationName,

              image: deployment.dockerImage,

              ports: [
                {
                  containerPort: deployment.containerPort,
                },
              ],
            },
          ],
        },
      },
    },
  };
};

export { generateDeploymentManifest };
