import AdmZip from 'adm-zip';
import { xmlParser } from './xmlTree';
import { findXml, readXml } from './utils';

export async function getContentXml(zip: AdmZip) {
    const { value, diags: contentDiags } = await getContentLocation(zip);
    const { value: xml, diags: xmlDiags } = await readXml(zip, value);

    return {
        value: xml,
        diags: [...contentDiags, ...xmlDiags],
    };
}

async function getContentLocation(zip: AdmZip) {
    const container = await getContainerXml(zip);
    if (container.value) {
        const rootFile = findXml(container.value, 'container', 'rootfiles', 'rootfile');
        const fullPath = rootFile?.attributes['full-path'];
        return fullPath !== undefined
            ? { value: fullPath, diags: [] }
            : {
                value: 'OEBPS/content.opf',
                diags: [{ diag: 'Can\'t find rootfile element' }],
            };
    } else {
        return {
            value: 'OEBPS/content.opf',
            diags: container.diags,
        };
    }
}

async function getContainerXml(zip: AdmZip) {
    const text = zip.readAsText('META-INF/container.xml');
    if (text === undefined) {
        return {
            diags: [{
                diag: 'No container file',
            }]
        };
    }
    const xml = xmlParser({ xmlString: text });
    if (xml === undefined) {
        return {
            diags: [{ diag: 'Can not parse container.xml' }]
        };
    } else {
        return { value: xml };
    }
}
