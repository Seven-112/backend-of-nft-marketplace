
//import Arweave from "arweave";
const fs = require('fs');
const Arweave = require('arweave');

const ASSETS_DIR = "./assets/";
const results = [];

const initOptions = {
  host: "arweave.net", // Hostname or IP address for a Arweave host
  port: 443, // Port
  protocol: "https", // Network protocol http or https
  timeout: 20000, // Network request timeouts in milliseconds
  logging: false, // Enable network request logging
};

const getMetadata = (name, imageUrl, attributes) => ({
  name,
  symbol: "MTVS",
  description:"Metaversus NFT is a NFT which can be used in metaverse",
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

// run localy
// npx @textury/arlocal
const initOptionsLocal = {
  host: "localhost", // Hostname or IP address for a Arweave host
  port: 1984, // Port
  protocol: "http", // Network protocol http or https
  timeout: 20000, // Network request timeouts in milliseconds
  // logging: false,     // Enable network request logging
};


const runUpload = async (arweave: any, data: any, contentType: string[], isUploadByChunk = false) => {
  let key = JSON.parse((fs.readFileSync('./arweaveKey.json')).toString());
  const tx = await arweave.createTransaction({ data: data }, key);

  tx.addTag(contentType[0], contentType[1]);

  await arweave.transactions.sign(tx, key);

  if (isUploadByChunk) {
    const uploader = await arweave.transactions.getUploader(tx);

    while (!uploader.isComplete) {
      await uploader.uploadChunk();
      console.log(
        `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
      );
    }
  }

  //   Do we need to post with uploader?
  await arweave.transactions.post(tx);

  //   console.log("url", `http://localhost:1984/${tx.id}`);
  //   console.log("url", `https://arweave.net/${tx.id}`);
  return tx;
};

const getAttributes = (props) => {
  // map attributes to the proper key/value objects
  const attrs = Object.keys(props).map((key) => {
    return {
      trait_type: key,
      value: props[key],
    };
  });

  return attrs;
};

export const uploadToArweave = async (id: number) => {
  const arweave = Arweave.init(initOptions);
  try {
      const traitData = JSON.parse((fs.readFileSync(ASSETS_DIR + id + '.json')).toString());
      // get separately name and props
      console.log("traitData =", traitData);

      const { name: name, ...props } = traitData;
      
      console.log("name", name);

      const imagePath = ASSETS_DIR + id + ".png";
      console.log("imagePath", imagePath);

      try {
        const data = fs.readFileSync(imagePath);
        // if (!data) console.warn(`Can't find file: ${filePath}`);

        const contentType = ["Content-Type", "image/png"];
        const { id } = await runUpload(arweave, data, contentType, true);
        const imageUrl = id ? `https://arweave.net/${id}` : undefined;
        console.log("imageUrl", imageUrl);

        const attributes = getAttributes(props);

        const metadata = getMetadata(name, imageUrl, attributes);
        // console.log(metadata);
        const metaContentType = ["Content-Type", "application/json"];
        const metadataString = JSON.stringify(metadata);
        const { id: metadataId } = await runUpload(
          arweave,
          metadataString,
          metaContentType
        );
        const metadataUrl = id
          ? `https://arweave.net/${metadataId}`
          : undefined;
        
        console.log("metadataUrl", metadataUrl);
        return { metadataUrl, name, symbol: "MTVS" };

      } catch (error) {
        console.error(error);
      }
  } catch  (error) {
    console.error(error);
  }
  return null;
};



