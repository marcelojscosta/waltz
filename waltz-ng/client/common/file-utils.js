import * as dsv from "d3-dsv";
import {isIE} from "./browser-utils";

export function downloadTextFile(dataRows = [],
                                 delimiter = ",",
                                 fileName = "download.csv") {
    const fileContent = dsv
        .dsvFormat(delimiter)
        .formatRows(dataRows);

    const D = document;
    const a = D.createElement('a');
    const strMimeType = 'application/octet-stream;charset=utf-8';
    let rawFile;

    // IE10+
    if (navigator.msSaveBlob) {
        return navigator.msSaveOrOpenBlob(
            new Blob(
                [fileContent],
                { type: strMimeType } ),
            fileName
        );
    }

    if (isIE()) {
        const frame = D.createElement('iframe');
        document.body.appendChild(frame);

        frame.contentWindow.document.open('text/html', 'replace');
        frame.contentWindow.document.write(fileContent);
        frame.contentWindow.document.close();
        frame.contentWindow.focus();
        frame.contentWindow.document.execCommand('SaveAs', true, fileName);

        document.body.removeChild(frame);
        return true;
    }

    //html5 A[download]
    if ('download' in a) {
        const blob = new Blob(
            [fileContent],
            {type: strMimeType}
        );
        rawFile = URL.createObjectURL(blob);
        a.setAttribute('download', fileName);
    } else {
        rawFile = 'data:' + strMimeType + ',' + encodeURIComponent(fileContent);
        a.setAttribute('target', '_blank');
    }

    a.href = rawFile;
    a.setAttribute('style', 'display:none;');
    D.body.appendChild(a);
    setTimeout(function() {
        if (a.click) {
            a.click();
            // Workaround for Safari 5
        } else if (document.createEvent) {
            const eventObj = document.createEvent('MouseEvents');
            eventObj.initEvent('click', true, true);
            a.dispatchEvent(eventObj);
        }
        D.body.removeChild(a);

    }, 100);
}