
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
  symbol: "Metaversus NFT",
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
  let key = {kty:"RSA",n:"8rpMP_5AVmjabe0s2t90qTwlDwYCYTCkwdn8oeBE2zN5ysw2MdTo_DePR5m9VOlgbJj6J2f1oM8wNKpSQZ7vhRU7DGon8dnw1TewFGY1V2HGEMMf1EhMprJIQZ_5C6fXMKPCJEUyffsO0UiA4iGWP0KMBdYItbgf1ecK0N8hhRLsqm0VWy4XUjltj8xCdp1aOhIVe1L-HPdlFb5uqzrePNuwZhF-W7HNjS9vqgSAZgmXyQsTYmg1GkbMGIg-QO9cBqQ3CUDewJmr91_UOY9c4YWm6Iaq9waOukSuVLl4EuQSm-xfkCZZHOWpcQQVpKWuh6tiG7X8TSW0e03vJpAJQVFd1n0VRJl_zLtr4msEyrjbDzjA3s0442hWZgfzBkuv-xqvuptH1-BBNqkUxpjqMZSvMiy9Bk3NEBUsIiU32eRPhvQhLzgv12L_Bc6dGm-lYgTEniSfKvkg0qq0_EKnQKR1QmNzta-IKFTUgJDcoUjKN1KIHOio44IN_bm9OyhFRw4eOWN-Z0gck7ruhHwxWXVhln_Gr6V5mwClAAubf_FcWlbljDqR52CJLJVFqYR_2uG0KKC0YFxHDP05qZ3SWSckNO9L8xOdOwWVVq4sPu0ZK6IsRHS192xu2ZwT7cJkCIDyJ6JQvlAxG1mO26rqN1_GmHlInF9KawaWXstzg58",e:"AQAB",d:"Qp8ntpjOh-kXqvxiR2D14E2Fzm3T0WFMl3iBgtzPiWrDjwomBd9uY2vMg9aKxPeZY7VJU--Q16aGkK3_DcvV6i09m9a3SAaNt7glODQlh-pqNseXwOhnQYnFk12ZOb3DrrID43iqtzFli8PevDKDzrExRZjNozL6afeUXGgiByh-lPiD2Bb6h7MDg2iJBY2C6lV0V_kbjk_JCwLN1Wm-_e0-qYU7rWdMB-hxObUqmNchNik4FNaNXLz53_HlRGVuWNRR1tRbT3neXXOMCJB06eGJQmFUI6FFI5MeVlrhvi2jffCO-j3MT8Ypj7-TQTHIiaxcrUZyDaq_suhdL7RxFVeluZPl2xc_K6sIQRkMMxs4tj9Ys0cWgnLrxOyWhkmcG8Q6Rd_F4CgWKJDVKehY8035QJhwJ6_VvloK49F8gYvVtqwFKbIpio1SptAg1dOxKir2nKg8OFWFX66yqCPgRvJ7PF9dNFYLQXAHyh27ZcD7d4Cuw5IEdVKeUeTrTrxbc-0UbFLGBKBAmeZPoNTju6UJVfpgirn4wRfzwRNq95tkfVLSIFGifKx8MvVwo4CLe0HSR6qpPVbZf0a1XS8rcan3koODRqzie593Ft24YiFcPeq_IT_1lHPmii6kN7ALNUIjWCg4cUpC2-bpgmUJl0jce3RH8oiBRemzMtBM7qE",p:"_mGVDNkizv9-prEkb2f7PZkZltgUP2-8EBlv9KTh28Y7ajCrMGHYYBA5Z8kXLQOkjtOxcVxdK0rci0dfHcd8OlJyNi2soeraGepQIDUdL4C4x7jwtA2a4Uc5V0VdbjViCLGy_fKo99y2nt2h-PlK_lAeA8VlbM-M6t6BV-2I_qEvqh1HuJwGnFmU8edFiCrMzhCgFMitd9KgJ55tEGAHGmxDk3LZ5U3uldAODzCwST_jtghfbm9Sf2aPlGn6AbdO9AKgzrfVxsfqlxRgAbLkbyT0PXlpknc7S7O3vIQzAswFFDcmxfvmylEkXkAf54LXUJpggPa08v37k22JYEujVQ",q:"9EW7EWcgS5Q-reuyhaREBNo3x9ZsZl3wRqxP9TLj7-hOV-OeuvDt01QaljS0aNfBPXePR_nn7Nz38HVFyN8oxi2MCTX56k3qr8KBYgPw49J9O3DI86icMZ0RjexrrGtW-C6ZUlqvbNEUiB7qWwL-5x9LLGbGuqONQOO1fZMS4tmKqO_nJcGKFNTIYPG9YV-_BduX7GhyLLEgS6oNq6Xh1gaQmMK_fI_hH_yzBcZJidLIW7IG1bGdFubkca7IpmaDUek21lIMVWmohtRxKzQwgxm9z-CCqP5Jrw_7CEly2Jmz4PdtT_-LQmoYbfAozIMmpGGcjIJPBgD5Dn89xclzIw",dp:"on-hoFCBDOxncoKMfOJWu1W25AZqgM-Wuk4Vl5lQcn1ibQZkBQcsGsmicisiM-40y8xteLYBCmvLEOnp1_Mb54HNVdC9i72jz5Q_1SM43qSC5Yq9sLdULf66oYY9Fe7iDh298r11tMh4nGmGU66kemqhkdUiYmz_XvX-eDXUIpzC_w-vRj3ddzk-jX0ojMCSjjxOlphPP9D73_MzRpehUf7A-EsQ6IttEqSSpp96rYAzrZARrlFMyPeyVqOQQlJgDD41jXggBtikghhQ8CTgCiP4JeEOULL73PMUN0fX8jx0LiLBEQ5Gsw08hzy9ZL3PX70OUrPGicc3U0lQzYPj9Q",dq:"a4b6hvmfdMWoJcU4S634py4sGdLg2tsFNwcJF4W0YtofCn9PUzlVZ46BOZevxusazGUB9IwktNa8aeQluPvLJhnMqA1Tmvl7kq0LaUsU0iTJLc5DF0ckoo5iuNfWugpyOUPCCEeVK1CKOjVpsnCKJtFWtQ_08Rmnx2W1cba5PJTIff9FABDHKM5V-p7PX7rXCswUf2OmxtedwND1vZaC6ETxh91Kj5mCXyNM5wDXRE0-F2cxrQXHgdpXu1dWSjGcIwWHNybc-QhOwDNqMbuCk2NUc9p_icaORvrA5W_3lzNpxGEGhI2YDr9HS7XJL-WXsAqr8Ao4oQryl5gZaCR6gw",qi:"UErj_EkjgnlFYTMES_vFCwJRqfahi0r4pOg_jo8pjvJILKpAzlplcyHQU5yDfjBir6Pv8UyxUFlyEUgGOljE8Muizhl_jORYl1bWg2GEN8rCShIfQGFjZS1mBBpeQjfTAYEw1HjjjAPpIY8wMT-7FLPjsij4Z3Cu0DXry6FSLp4ZLyz8f33EMW0eUUNYEu7DhNG8BvZnHJCoKiMuuts52Sua3Vrj7nNyifagUwcw5J1QNzUyFoXF66euSLnmGDOWp63e-hGPPBAEEMmv4TdPFgd96GhQhxmqxPD87n2SiJjESccKMYSXpDaAs1ADZh-c9PNbLHV0EbzKuYzV4FC5nw"};
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
        return { metadataUrl, name, symbol: "Metaversus NFT" };

      } catch (error) {
        console.error(error);
      }
  } catch  (error) {
    console.error(error);
  }
  return null;
};



