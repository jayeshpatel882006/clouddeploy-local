/**
 * RegistryDriver
 *
 * Placeholder driver for container registry operations.
 *
 * In future phases this class will interact with Docker
 * Registry, ECR, GCR, or any OCI-compatible registry.
 *
 * Every method currently throws "Not Implemented" and
 * logs the intended operation for future wiring.
 */

class RegistryDriver {
  /**
   * Push an image to the configured registry.
   * @param {string} imageName - Fully qualified image name:tag
   * @returns {Promise<{success:boolean,digest:string}>}
   */
  async pushImage(imageName) {
    throw new Error(
      `[RegistryDriver] Not Implemented: pushImage("${imageName}")`,
    );
  }

  /**
   * Pull an image from the configured registry.
   * @param {string} imageName - Fully qualified image name:tag
   * @returns {Promise<{success:boolean}>}
   */
  async pullImage(imageName) {
    throw new Error(
      `[RegistryDriver] Not Implemented: pullImage("${imageName}")`,
    );
  }

  /**
   * List tags available for a given image.
   * @param {string} imageName - Image repository name
   * @returns {Promise<{success:boolean,tags:string[]}>}
   */
  async listTags(imageName) {
    throw new Error(
      `[RegistryDriver] Not Implemented: listTags("${imageName}")`,
    );
  }

  /**
   * Delete an image tag from the registry.
   * @param {string} imageName - Image name:tag to delete
   * @returns {Promise<{success:boolean}>}
   */
  async deleteImage(imageName) {
    throw new Error(
      `[RegistryDriver] Not Implemented: deleteImage("${imageName}")`,
    );
  }

  /**
   * Check if an image exists in the registry.
   * @param {string} imageName - Image name:tag to check
   * @returns {Promise<{success:boolean,exists:boolean}>}
   */
  async imageExists(imageName) {
    throw new Error(
      `[RegistryDriver] Not Implemented: imageExists("${imageName}")`,
    );
  }
}

export { RegistryDriver };
