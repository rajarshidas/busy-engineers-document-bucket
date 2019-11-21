/* ADD-ESDK-START:
 * Add the @aws-crypto/client-node dependency.
 * You will need the decrypt stream as well as the KMS keyring.
 * Look at the config file to see how to pull the Faythe CMK.
 * Then pipe the encrypted stream to the decrypt stream: Profit.
 */

const { decryptStream, KmsKeyringNode } = require("@aws-crypto/client-node");
const { S3 } = require("aws-sdk");
const s3 = new S3();
const config = require("./config");
const Bucket = config.state.bucketName();

const faytheCMK = config.state.getFaytheCMK();
const decryptKeyring = new KmsKeyringNode({ keyIds: [faytheCMK] });

module.exports = retrieve;

function retrieve(Key, { expectedContext, expectedContextKeys } = {}) {
  const verify = verifyFn(expectedContext, expectedContextKeys);
  return s3
    .getObject({ Bucket, Key })
    .createReadStream()
    .pipe(decryptStream(decryptKeyring));
}
