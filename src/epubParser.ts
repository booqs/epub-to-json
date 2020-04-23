import AdmZip from 'adm-zip';
export async function parseEpub({ filePath }: {
    filePath: string,
}) {
    const zip = new AdmZip(filePath);
    return zip;
}
