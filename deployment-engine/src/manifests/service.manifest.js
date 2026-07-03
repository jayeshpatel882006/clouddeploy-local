const generateServiceManifest = (deployment) => {
  return {
    apiVersion: "v1",

    kind: "Service",

    metadata: {
      name: deployment.applicationName,

      namespace: deployment.namespace || "default",
    },

    spec: {
      selector: {
        app: deployment.applicationName,
      },

      ports: [
        {
          protocol: "TCP",

          port: 80,

          targetPort: deployment.containerPort,
        },
      ],

      type: "ClusterIP",
    },
  };
};

export { generateServiceManifest };
