/**
 * DockerDriver
 *
 * Placeholder driver for Docker operations.
 *
 * In future phases this class will execute real Docker CLI
 * commands or interact with the Docker SDK.
 *
 * Every method currently throws "Not Implemented" and
 * logs the intended operation for future wiring.
 */

class DockerDriver {
  /**
   * Build a Docker image from a Dockerfile.
   * @param {string} imageName - Tag for the built image
   * @param {string} [dockerfilePath="."] - Path to build context
   * @returns {Promise<{success:boolean,imageName:string}>}
   */
  async buildImage(imageName, dockerfilePath = ".") {
    throw new Error(
      `[DockerDriver] Not Implemented: buildImage("${imageName}", "${dockerfilePath}")`,
    );
  }

  /**
   * Tag an existing image with a new tag.
   * @param {string} sourceImage - Existing image name:tag
   * @param {string} targetImage - New image name:tag
   * @returns {Promise<{success:boolean}>}
   */
  async tagImage(sourceImage, targetImage) {
    throw new Error(
      `[DockerDriver] Not Implemented: tagImage("${sourceImage}", "${targetImage}")`,
    );
  }

  /**
   * Pull an image from a registry.
   * @param {string} imageName - Image to pull
   * @returns {Promise<{success:boolean}>}
   */
  async pullImage(imageName) {
    throw new Error(
      `[DockerDriver] Not Implemented: pullImage("${imageName}")`,
    );
  }

  /**
   * Remove an image from the local Docker daemon.
   * @param {string} imageName - Image to remove
   * @returns {Promise<{success:boolean}>}
   */
  async removeImage(imageName) {
    throw new Error(
      `[DockerDriver] Not Implemented: removeImage("${imageName}")`,
    );
  }

  /**
   * List images available in the local Docker daemon.
   * @returns {Promise<{success:boolean,images:Array}>}
   */
  async listImages() {
    throw new Error("[DockerDriver] Not Implemented: listImages()");
  }
}

export { DockerDriver };
