const fs = require('fs');
const path = require('path');

/**
 * This will match and capture raw documentation filenames (ignoring any prefixes)
 * e.g it will match `internal.ConferenceService.md` and capture `ConferenceService`
 * @type {RegExp}
 */
const REGEXP_MATCH_DOC_FILENAME = /.+\/internal\.(\w+)\.md/;

/**
 * This will match and capture all documentation links that need to be changed
 * e.g it will match `[internal](../modules/internal.md)` and capture
 * `../modules/internal.md`
 * @type {RegExp}
 */
const REGEXP_MATCH_DOC_LINKS_G = /\[.+?]\((.+?\.md)(?:#.+?)?\)/g;
const REGEXP_MATCH_DOC_LINKS = /\[.+?]\((.+?\.md)(?:#.+?)?\)/;

/**
 * This will match and capture module name after /docs/ e.g it will match
 * `interfaces` from `../docs/interface/Conference.md`
 * @type {RegExp}
 */
const REGEXP_MATCH_DOC_MODULE = /docs\/(\w+)\//;

const SLUG_PREFIX = 'rn-client-sdk-';

// TODO: updatedAt and createdAt is equal in header, should not be

const filePathList = [];

(async function () {
  const docsDir = '../docs';
  buildFilesPathArray(docsDir);
  filePathList.forEach((filePath, index) => {
    let moduleName = getFilePathModuleName(filePath);
    let headerTemplate = '';

    if (isFilepathCorrect(filePath) && moduleName) {
      const slug = createHeaderSlug(filePath);
      console.log(slug);
      headerTemplate = buildHeaderTemplate(moduleName, slug, index);
      if (index == 5) {
        // console.log(headerTemplate);
        fs.readFile(filePath, (e, data) => {
          const docAsString = data.toString();
          const docWithHeader = headerTemplate + docAsString;
          const r = new RegExp('\\[.+]\\((.+.md)(?:#.+)?\\)', 'g');
          // const test = r.exec(docWithHeader);
          // const a = docWithHeader.matchAll(REGEXP_MATCH_DOC_LINKS);
          const g = docWithHeader.replaceAll(
            REGEXP_MATCH_DOC_LINKS_G,
            replaceLinkReplacerFn
          );
          // console.log(g);
          // console.log(g);
          // [...a].forEach((match) => {
          //   console.log('wtf', match[1]);
          // });
          // console.log(docWithHeader);
        });
      }
    }
  });

  // fs.readFile('test.md', (e, data) => {
  //   const rawMd = data.toString();
  //   const ee = template + rawMd;
  //   console.log(ee);
  // });
})();

function buildHeaderTemplate(originalFilename, slug, order) {
  return `
---
apiVersion: 1.0
categoryName: ReactNative SDK
title: ${originalFilename}
slug: ${slug}
excerpt: None
category: 60b289fa3ada0c007f41d5a9
order: ${order}
hidden: False
createdAt: ${new Date().toISOString()}
updatedAt: ${new Date().toISOString()}
metadata:
  title: ${originalFilename}
  description: Explore our JavaScript Documentation to build beautiful web video conferencing integration for your Website.
  image:
    [
      "https://files.readme.io/eaba311-dolbyio-seo-image.jpg",
      "dolbyio-seo-image.jpg",
      2048,
      1072,
      "#120000",
    ]
---\n
`;
}

function buildFilesPathArray(dir) {
  fs.readdirSync(dir).forEach((fileOrDir) => {
    const fullPath = path.join(dir, fileOrDir);
    if (fs.lstatSync(fullPath).isDirectory()) {
      buildFilesPathArray(fullPath);
    } else {
      filePathList.push(fullPath);
    }
  });
}
function isFilepathCorrect(filepath) {
  return !!new RegExp(REGEXP_MATCH_DOC_FILENAME).test(filepath);
}

function createHeaderSlug(filePath) {
  const sdkModule = filePath.match(REGEXP_MATCH_DOC_MODULE)[1];
  const rawFilename = filePath.match(REGEXP_MATCH_DOC_FILENAME)[1];
  return SLUG_PREFIX + sdkModule + `-${rawFilename.toLowerCase()}`;
}

function getFilePathModuleName(filePath) {
  const moduleName = filePath.match(REGEXP_MATCH_DOC_MODULE);
  if (moduleName) {
    return moduleName[1];
  }
  return '';
}

function replaceLinkReplacerFn(substring) {
  let replaceString;
  console.log(substring);
  const isRootInternalModule = new RegExp('internal.md').test(substring);
  const module = substring.match(/\(\.\.\/(.+)\//);
  const service = substring.match(/internal\.(.+)\.md(#.+)?\)/);
  if (isRootInternalModule) {
    const hash = substring.match(/internal.md(#.+)\)/);
    const h =
      'doc:' + SLUG_PREFIX + 'modules-internal' + `${hash ? hash[1] : ''}`;
    return substring.replace(/(?<=\[.+]\().+\.md(?=\))/, h);
  }
  // console.log(substring, service);
  const serviceSuffix = service[2] || '';
  replaceString = service
    ? 'doc:' +
      SLUG_PREFIX +
      (module ? `${module[1]}-` : '') +
      `${service[1].toLowerCase()}` +
      serviceSuffix
    : 'error';
  return substring.replace(/(?<=\[.+]\().+\.md(?=\))/, replaceString);
}
