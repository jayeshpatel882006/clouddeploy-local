import {
  deleteDeployment,
  deleteService,
} from "../kubernetes/kubernetes.delete.js";

export const deleteApplication = async ({
  deploymentName,
  serviceName,
  namespace = "default",
}) => {
  await deleteDeployment(deploymentName, namespace);

  await deleteService(serviceName, namespace);

  return {
    success: true,
  };
};
