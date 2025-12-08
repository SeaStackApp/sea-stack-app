import { S3Storage } from './getS3Storage';
import { sh } from '../../sh';
import { decrypt } from '../../crypto';

export const generateRcloneFlags = (s3: S3Storage) => {
    return [
        '--s3-provider=Other',
        sh`--s3-access-key-id=${decrypt(s3.accessKeyId)}`,
        sh`--s3-secret-access-key=${decrypt(s3.secretAccessKey)}`,
        sh`--s3-endpoint=${s3.endpoint}`,
        s3.region ? `--s3-region=${s3.region}` : '',
        '--s3-acl=private',
        sh`--s3-force-path-style=${s3.usePathStyle ? 'true' : 'false'}`,
    ].join(' ');
};
