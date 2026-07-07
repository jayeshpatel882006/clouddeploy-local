import axios from "axios";

const REGISTRY_URL = process.env.REGISTRY_URL || "http://localhost:5000";

export const getRegistryRepositories = async () => {
  const { data } = await axios.get(`${REGISTRY_URL}/v2/_catalog`);

  const repositories = data.repositories || [];

  const registry = await Promise.all(
    repositories.map((repo) => getRepositoryTags(repo)),
  );

  return registry;
};

export const getRepositoryTags = async (repository) => {
  const { data } = await axios.get(
    `${REGISTRY_URL}/v2/${repository}/tags/list`,
  );

  return {
    repository: data.name,
    tags: data.tags || [],
  };
};
