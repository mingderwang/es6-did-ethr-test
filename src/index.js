import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import EthrDID from "ethr-did";
import { Issuer } from "did-jwt-vc";
import {
  JwtCredentialPayload,
  createVerifiableCredentialJwt
} from "did-jwt-vc";
import {
  JwtPresentationPayload,
  createVerifiablePresentationJwt
} from "did-jwt-vc";

import { verifyCredential } from "did-jwt-vc";
import { verifyPresentation } from "did-jwt-vc";
var didResolver = require("did-resolver");
const ethrDidResolver = require("ethr-did-resolver");

const didJWT = require('did-jwt')
const signer = didJWT.SimpleSigner('278a5de700e29faae8e40e366ec5012b5ec63d36ec77e8a2417154cc1d25383f');

const issuer: Issuer = new EthrDID({
  address: "0xf1232f840f3ad7d23fcdaa84d6c66dac24efb198",
  privateKey: "d8b595680851765f38ea5405129244ba3cbad84467d190859f4c8b20c1ff6c75"
});

console.log(issuer);

const providerConfig = {
  networks: [
    {
      name: "mainnet",
      rpcUrl: "https://mainnet.infura.io/v3/fc0cfd949f9742e8929b462a2055ecdd"
    },
    {
      name: "0x4",
      rpcUrl:
        "https://rinkeby.infura.io/v3/https://rinkeby.infura.io/v3/fc0cfd949f9742e8929b462a2055ecdd"
    },
    { name: "development", rpcUrl: "http://localhost:7545" }
  ]
};

const ethrResolver = ethrDidResolver.getResolver(providerConfig);

const resolver = new didResolver.Resolver(ethrResolver);

//Use 'ethjs-provider-http' instead of 'web3' due to this issue: https://github.com/uport-project/ethr-did/issues/3#issuecomment-413908925
const HttpProvider = require("ethjs-provider-http");
let provider = new HttpProvider("https://rinkeby.infura.io");

let test = async () => {
  //Registery address for ethr did
  let registryAddress = "0xdCa7EF03e98e0DC2B855bE647C39ABe984fcF21B";

  //Generating Eth keyPair
  const keypair = EthrDID.createKeyPair();

  //Generating Ethr DID
  const ethrDid = new EthrDID({
    ...keypair,
    provider,
    registry: registryAddress
  });

  let did = ethrDid.did;
  console.log("\n\nEthr DID\n\n");
  console.log(ethrDid);
  //Resolving Ethr DID to DID document
  resolver
    .resolve(did)
    .then((didDocument) => {
      console.log("\n\nEthr DID Document\n\n");
      console.log(didDocument);
    })
    .catch((error) => {
      console.error(error);
    });
};

let test2 = async () => {
  const vcPayload: JwtCredentialPayload = {
    sub: "did:ethr:0x435df3eda57154cf8cf7926079881f2912f54db4",
    nbf: 1562950282,
    vc: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      type: ["VerifiableCredential"],
      credentialSubject: {
        degree: {
          type: "BachelorDegree",
          name: "Baccalauréat en musiques numériques"
        }
      }
    }
  };

  const vcJwt = await createVerifiableCredentialJwt(vcPayload, issuer);
  console.log("vcJwt")
  console.log(vcJwt);
  const vpPayload: JwtPresentationPayload = {
    vp: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      type: ["VerifiablePresentation"],
      verifiableCredential: [vcJwt]
    }
  };

  const vpJwt = await createVerifiablePresentationJwt(vpPayload, issuer);
  console.log("vcJwt")
  console.log(vpJwt);

  const verifiedVC = await verifyCredential(vcJwt, resolver);
  console.log("verifiedVC")
  console.log(verifiedVC);

  const verifiedVP = await verifyPresentation(vpJwt, resolver);
  console.log("verifiedVP")
  console.log(verifiedVP.payload.vp);
};

let test3 = async () => {
  let jwt = await didJWT.createJWT({aud: 'did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74', exp: 1957463421, name: 'uPort Developer'},
                 {alg: 'ES256K', issuer: 'did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74', signer})
console.log("jwt")
console.log(jwt);
let decoded = didJWT.decodeJWT(jwt)
console.log("decoded jwt")
console.log(decoded)
let verifiedRespone = await didJWT.verifyJWT(jwt, {resolver: resolver, audience: 'did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74'})
console.log("verifiedRespone");
console.log(verifiedRespone);

}

test();
test2();
test3();
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
