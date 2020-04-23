import AdmZip from 'adm-zip';
import { xmlParser, Xml, XmlElement } from './xmlTree';

export function findXml(xml: Xml, ...path: string[]): XmlElement | undefined {
    if (xml.type !== 'document' && xml.type !== 'element') {
        return undefined;
    }
    const [head, ...tail] = path;
    if (!head) {
        return undefined;
    }
    const element = xml.children
        .find(el => el.name === head);
    if (element && element.name) {
        if (tail?.length > 0) {
            return findXml(element, ...tail);
        } else {
            return element;
        }
    } else {
        return undefined;
    }
}

export async function readXml(zip: AdmZip, path: string) {
    const text = zip.readAsText(path);
    if (text === undefined) {
        return {
            diags: [{
                diag: `No file for path: ${path}`,
            }]
        };
    }
    const xml = xmlParser({ xmlString: text });
    if (xml === undefined) {
        return {
            diags: [{ diag: `Can not parse ${path}` }]
        };
    } else {
        return { value: xml, diags: [] };
    }
}
