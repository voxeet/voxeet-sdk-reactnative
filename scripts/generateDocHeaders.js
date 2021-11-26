const fs = require('fs');
const path = require('path');

/**
 * This will match and capture raw documentation filenames (ignoring any prefixes)
 * e.g it will match `internal.ConferenceService.md` and capture `ConferenceService`
 */
const REGEXP_MATCH_DOC_FILENAME = /.+\/internal\.(\w+)\.md/;

/**
 * This will match and capture all documentation links that need to be changed
 * e.g it will match `[internal](../modules/internal.md)` and capture
 * `../modules/internal.md`
 */
const REGEXP_MATCH_DOC_LINKS = /\[.+?]\((.+?\.md)(?:#.+?)?\)/g;

/**
 * This will match and capture module name after /docs/ e.g it will match
 * `interfaces` from `../docs/interface/Conference.md`
 */
const REGEXP_MATCH_DOC_MODULE = /docs\/(\w+)\//;

const SLUG_PREFIX = 'rn-client-sdk-';
const LINK_SLUG_PREFIX = 'doc:rn-client-sdk-';

// TODO: updatedAt and createdAt is equal in header, should not be

const filePathList = [];

(async function () {
  const docsDir = '../docs';
  buildFilesPathArray(docsDir);
  filePathList.forEach((filePath, index) => {
    let moduleName = getFilePathModuleName(filePath);
    let headerTemplate = '';
    let transformedFileContents = '';

    if (isFilepathCorrect(filePath) && moduleName) {
      const slug = createHeaderSlug(filePath);
      headerTemplate = buildHeaderTemplate(moduleName, slug, index);
      const newFileName = path.dirname(filePath) + `/${slug}.md`;

      const data = fs.readFileSync(filePath);
      if (!data) {
        throw new Error(`[${filePath}]: reading file error`);
      }
      const docAsString = data.toString();
      const docWithHeader = headerTemplate + docAsString;
      transformedFileContents = docWithHeader.replaceAll(
        REGEXP_MATCH_DOC_LINKS,
        changeLinkFormatReplacerFn
      );
      try {
        fs.writeFileSync(filePath, transformedFileContents);
        fs.renameSync(filePath, newFileName);
      } catch {
        throw new Error(`[${filePath}]: writing or renaming error`);
      }
      console.log('Conversion successful!');
    }
  });
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

/**
 * This functions appends all doc file paths to global filePathList variable
 */
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

/**
 * This function ensures that whatever file we're reading and changing, has `internal`
 * in it's path (then it means it's DolbyIoSDK module)
 */
function isFilepathCorrect(filepath) {
  return !!new RegExp(REGEXP_MATCH_DOC_FILENAME).test(filepath);
}

/**
 * This function creates header slug (format slug prefix + module + filename in lowercase)
 * e.g slug for a file `../docs/interfaces/ConferenceMixingOptions.md` should look like
 * `rn-client-sdk-interfaces-conferencemixingoptions`
 * NOTE: at this point we assume filepath is correct (isFilepathCorrect function should return true)
 */
function createHeaderSlug(filePath) {
  const sdkModule = filePath.match(REGEXP_MATCH_DOC_MODULE)[1];
  const rawFilename = filePath.match(REGEXP_MATCH_DOC_FILENAME)[1];
  return SLUG_PREFIX + sdkModule + `-${rawFilename.toLowerCase()}`;
}

/**
 * This function gets module name from filepath, e.g from `../docs/interfaces/Conference.md`
 * it should return `interfaces`
 */
function getFilePathModuleName(filePath) {
  const moduleName = filePath.match(REGEXP_MATCH_DOC_MODULE);
  if (moduleName) {
    return moduleName[1];
  }
  return '';
}

function changeLinkFormatReplacerFn(substring) {
  let replaceString;
  const isRootInternalModule = new RegExp('internal.md').test(substring);
  if (isRootInternalModule) {
    replaceString = LINK_SLUG_PREFIX + 'modules-internal';
    return substring.replace(/(?<=\[.+]\().+\.md(?=(#.+)?\))/, replaceString);
  }
  const module = substring.match(/\(\.\.\/(.+)\//);
  const service = substring.match(/internal\.(.+)\.md(#.+)?\)/);
  replaceString = service
    ? LINK_SLUG_PREFIX +
      (module ? `${module[1]}-` : '') +
      `${service[1].toLowerCase()}`
    : 'error';
  return substring.replace(/(?<=\[.+]\().+\.md(?=.+\))?/, replaceString);
}
