import AdmZip from 'adm-zip';
import { getContentXml } from './content';

export async function parseEpub({ filePath }: {
    filePath: string,
}) {
    const zip = new AdmZip(filePath);
    const content = getContentXml(zip);
    return content;
}
