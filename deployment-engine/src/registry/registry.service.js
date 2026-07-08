import axios from "axios";
import { inspectImage } from "./registry.inspect.js";

const REGISTRY_URL = process.env.REGISTRY_URL || "http://localhost:5000";

export const getRegistryRepositories = async () => {
  const { data } = await axios.get(`${REGISTRY_URL}/v2/_catalog`);

  const repositories = data.repositories || [];

  const registry = await Promise.all(
    repositories.map(async (repository) => {
      return await getRepositoryTags(repository);
    }),
  );

  return registry;
};

export const getRepositoryTags = async (repository) => {
  const { data } = await axios.get(
    `${REGISTRY_URL}/v2/${repository}/tags/list`,
  );

  const tags = data.tags || [];

  const images = await Promise.all(
    tags.map(async (tag) => {
      const metadata = await inspectImage(repository, tag);

      return {
        repository,
        tag,
        ...metadata,
      };
    }),
  );

  return {
    repository,
    images,
  };
};
