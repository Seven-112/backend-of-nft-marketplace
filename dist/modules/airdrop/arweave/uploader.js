"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToArweave = void 0;
const fs_1 = require("fs");
const arweave_1 = require("arweave");
const ASSETS_DIR = "../assets/";
const results = [];
const initOptions = {
    host: "arweave.net",
    port: 443,
    protocol: "https",
    timeout: 20000,
    logging: false,
};
const getMetadata = (name, imageUrl, attributes) => ({
    name,
    symbol: "Metaversus NFT",
    description: "Metaversus NFT is a NFT which can be used in metaverse",
    seller_fee_basis_points: 500,
    external_url: "https://www.metaversus.com/",
    attributes,
    collection: {
        name: "Metaversus NFT",
        family: "metaversus",
    },
    properties: {
        files: [
            {
                uri: imageUrl,
                type: "image/png",
            },
        ],
        category: "image",
        maxSupply: 0,
        creators: [
            {
                address: "CBBUMHRmbVUck99mTCip5sHP16kzGj3QTYB8K3XxwmQx",
                share: 100,
            },
        ],
    },
    image: imageUrl,
});
const initOptionsLocal = {
    host: "localhost",
    port: 1984,
    protocol: "http",
    timeout: 20000,
};
const runUpload = async (arweave, data, contentType, isUploadByChunk = false) => {
    let key = await arweave.wallets.generate();
    const tx = await arweave.createTransaction({ data: data }, key);
    tx.addTag(contentType[0], contentType[1]);
    await arweave.transactions.sign(tx, key);
    if (isUploadByChunk) {
        const uploader = await arweave.transactions.getUploader(tx);
        while (!uploader.isComplete) {
            await uploader.uploadChunk();
            console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
        }
    }
    await arweave.transactions.post(tx);
    return tx;
};
const folder = "./public/images/";
let metadataCollection = {};
const getAttributes = (props) => {
    const attrs = Object.keys(props).map((key) => {
        return {
            trait_type: key,
            value: props[key],
        };
    });
    return attrs;
};
const uploadToArweave = async (id) => {
    const arweave = arweave_1.default.init(initOptions);
    try {
        const traitData = JSON.parse((fs_1.default.readFileSync(ASSETS_DIR + id + '.json')).toString());
        const { Name: name } = traitData, props = __rest(traitData, ["Name"]);
        console.log("name", name);
        const imagePath = ASSETS_DIR + id + ".png";
        console.log("imagePath", imagePath);
        try {
            const data = fs_1.default.readFileSync(imagePath);
            const contentType = ["Content-Type", "image/png"];
            const { id } = await runUpload(arweave, data, contentType, true);
            const imageUrl = id ? `https://arweave.net/${id}` : undefined;
            console.log("imageUrl", imageUrl);
            const attributes = getAttributes(props);
            const metadata = getMetadata(name, imageUrl, attributes);
            const metaContentType = ["Content-Type", "application/json"];
            const metadataString = JSON.stringify(metadata);
            const { id: metadataId } = await runUpload(arweave, metadataString, metaContentType);
            const metadataUrl = id
                ? `https://arweave.net/${metadataId}`
                : undefined;
            console.log("metadataUrl", metadataUrl);
            return { metadataUrl, name, symbol: "Metaversus NFT" };
        }
        catch (error) {
            console.error(error);
        }
    }
    catch (error) {
        console.error(error);
    }
    return null;
};
exports.uploadToArweave = uploadToArweave;
//# sourceMappingURL=uploader.js.map