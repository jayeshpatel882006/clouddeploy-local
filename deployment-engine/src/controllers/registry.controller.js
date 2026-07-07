import { getRegistryRepositories } from "../registry/registry.service.js";

export const getRegistry = async (req, res, next) => {
  try {
    const repositories = await getRegistryRepositories();

    res.json({
      success: true,
      repositories,
    });
  } catch (error) {
    next(error);
  }
};
