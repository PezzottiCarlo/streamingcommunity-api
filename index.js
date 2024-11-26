import fetch from 'node-fetch';
import fs from 'fs';

class StreamingApi {

    siteUrl;

    constructor(siteUrl) {
        this.siteUrl = siteUrl;
    }

    async getInertia() {
        let res = await fetch(`${this.siteUrl}`, {
            "headers": {
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
            },
            "body": null,
            "method": "GET"
        });
        let text = await res.text();
        //dal testo estrai inertia ",&quot;url&quot;:&quot;/&quot;,&quot;version&quot;:&quot;1171b9202c71489193f5fed2bc7b43bb&quot;}"> da estrarre 1171b9202c71489193f5fed2bc7b43bb
        let inertia = text.match(/&quot;url&quot;:&quot;\/&quot;,&quot;version&quot;:&quot;[a-z0-9]*&quot;/g);
        let inertiaValue = (inertia[0].replace(/&quot;:&quot;/g, '').replace(/&quot;/g, '')).split('version')[1];
        return inertiaValue;
    }


    async search(inertiaVersion, query) {
        let res = await fetch(`${this.siteUrl}/search?q=${query}`, {
            headers: {
                accept: "text/html, application/xhtml+xml",
                "content-type": "application/json",
                "x-inertia": "true",
                "x-inertia-version": `${inertiaVersion}`,
            },
            "body": null,
            "method": "GET"
        });
        let data = await res.json();
        return data;
    }
}


function main() {
    const siteUrl = 'https://streamingcommunity.computer';
    const streamingApi = new StreamingApi(siteUrl);
    streamingApi.getInertia().then(inertiaVersion => {
        streamingApi.search(inertiaVersion,'adventure').then(data => {
            console.log(data);
        });
    });
}

main();