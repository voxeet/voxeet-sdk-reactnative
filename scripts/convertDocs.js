const fs = require('fs');
const path = require('path');

/**
 * This will match and capture raw documentation filenames (ignoring any prefixes)
 * e.g. it will match `internal.ConferenceService.md` and capture `ConferenceService`
 */
const REGEXP_MATCH_DOC_FILENAME = /(?:.+\/internal\.)?(\w+)\.md/;

/**
 * This will match and capture all documentation links that need to be changed
 * e.g. it will match `[internal](../modules/internal.md)` and capture
 * `../modules/internal.md`
 */
const REGEXP_MATCH_DOC_LINKS = /\[.+?]\((.+?\.md)(?:#.+?)?\)/g;

/**
 * This will match and capture module name after /docs/ e.g. it will match
 * `../docs/interface/Conference.md` and capture `interface`
 */
const REGEXP_MATCH_DOC_MODULE = /docs\/(\w+)\//;

const REGEXP_MATCH_CONSTRUCTOR_HEADER = /###? Constructors?/gi;
const REGEXP_MATCH_CONSTRUCTOR_LINK = /- \[constructor].+/g;
const REGEXP_MATCH_CONSTRUCTOR_INIT = /• \*\*new.+/g;
const REGEXP_MATCH_INTERNAL_LINKS = /\[internal].+/g;
const REGEXP_MATCH_CLASS_TITLES = /# Class: \w+/g;

/**
 * This will match and capture all full link descriptions
 * e.g. it will capture `Participant` and Participant from [`Participant`](../interfaces/internal.Participant.md)
 * (we want to replace [`Participant`] for [Participant])
 */
const REGEXP_MATCH_BACKTICKS = /\[(`(\w+)`)?]\(.+?\)/g;

const SLUG_PREFIX = 'rn-client-sdk-';
const LINK_SLUG_PREFIX = 'doc:rn-client-sdk-';

const FILE_PATHS = [];
const DOCS_DIR = '../docs';

const IGNORED_FILES = ['modules.md', '.nojekyll', 'README.md'];

/**
 * This function will convert current auto-generated docs to format that is aligned with
 * internal Dolby requirements for distributing documentation on Dolby.io website.
 * It takes DOCS_DIR variable and uses it as an entrypoint for traversing documentation files.
 * After that, it will iterate over each file, create a new slug, insert a header and then write
 * that as a new file to ./scripts/docs directory
 *
 * How to use:
 * Run `node convertDocs.js` in scripts directory. A docs directory should be created with all converted files.
 */
(async function () {
  const nodeVersion = process.versions.node.match(/(\d.)\.\d./);
  if (nodeVersion) {
    if (Number(nodeVersion[1]) < 15) {
      throw new Error('Minimum node version needed is v15!');
    }
  } else {
    console.error('Unknown node version... Proceeding anyway.');
  }
  buildFilesPathArray(DOCS_DIR);

  const FILTERED_FILE_PATHS = FILE_PATHS.filter(
    (p) => !IGNORED_FILES.includes(path.basename(p))
  );

  if (!FILTERED_FILE_PATHS.length)
    throw new Error(`No file paths found to work on!`);

  FILTERED_FILE_PATHS.forEach(convertDoc);

  console.log('Conversion successful!');
})();

function createDocHeader(rawModuleName, slug, order) {
  return `---
apiVersion: 1.0
categoryName: React Native SDK
title: ${rawModuleName}
slug: ${slug}
excerpt: None
category: 60b289fa3ada0c007f41d5a9
order: ${order}
hidden: False
createdAt: ${new Date().toISOString()}
updatedAt: ${new Date().toISOString()}
metadata:
  title: ${rawModuleName}
  description: Explore our React Native SDK documentation to create a video conference application.
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

function convertDoc(filePath, index) {
  let renamedFilepath = filePath;

  if (/classes/.test(renamedFilepath)) {
    renamedFilepath = renamedFilepath.replace(/classes/, 'references');
  } else if (/interfaces/.test(renamedFilepath)) {
    renamedFilepath = renamedFilepath.replace(/interfaces/, 'models');
  }
  let moduleName = getFilePathModuleName(renamedFilepath);

  if (isInternalDocFile(renamedFilepath) && moduleName) {
    const rawFileName = filePath.match(REGEXP_MATCH_DOC_FILENAME);
    if (!rawFileName) {
      throw new Error(`[${renamedFilepath}]: reading raw filename error`);
    }
    const slug = createHeaderSlug(renamedFilepath);
    const header = createDocHeader(rawFileName[1], slug, index);
    // we use substring to create new path; here we're going from
    // ../docs/interface/.. to ./docs/interface/..
    const newFilePath = path.dirname(renamedFilepath).substring(1);
    const newFileName = newFilePath + `/${slug}.md`;

    const fileBuffer = fs.readFileSync(filePath);
    if (!fileBuffer) {
      throw new Error(`[${filePath}]: reading file error`);
    }
    const docAsString = fileBuffer.toString();
    const docWithHeader = header + docAsString;
    const convertedDocAsString = docWithHeader
      .replaceAll(REGEXP_MATCH_DOC_LINKS, (substring) =>
        changeLinkFormatReplacerFn(substring, moduleName)
      )
      .replaceAll(REGEXP_MATCH_CONSTRUCTOR_HEADER, '')
      .replaceAll(REGEXP_MATCH_CONSTRUCTOR_LINK, '')
      .replaceAll(REGEXP_MATCH_CONSTRUCTOR_INIT, '')
      .replaceAll(REGEXP_MATCH_INTERNAL_LINKS, '')
      .replaceAll(REGEXP_MATCH_CLASS_TITLES, '')
      .replaceAll(
        REGEXP_MATCH_BACKTICKS,
        (substring, captureGroupOne, captureGroupTwo) => {
          return substring.replace(
            /(?<=\[)(`(\w+)`)(?=]\(.+\))/,
            captureGroupTwo
          );
        }
      );
    try {
      if (!fs.existsSync(newFilePath)) {
        fs.mkdirSync(newFilePath, {
          recursive: true,
        });
      }

      fs.writeFileSync(newFileName, convertedDocAsString);
    } catch (e) {
      console.error(`[${filePath.substring(1)}]: writing or renaming error`);
      console.error(e);
    }
  } else {
    console.error('Filepath not correct', filePath);
  }
}

/**
 * This function traverses pointed dir and adds all paths to global FILE_PATHS variable
 */
function buildFilesPathArray(dir) {
  fs.readdirSync(dir).forEach((fileOrDir) => {
    const fullPath = path.join(dir, fileOrDir);
    if (fs.lstatSync(fullPath).isDirectory()) {
      buildFilesPathArray(fullPath);
    } else {
      FILE_PATHS.push(fullPath);
    }
  });
}

/**
 * This function ensures that whatever file we're reading and changing, has `internal`
 * in its path (then it means it's DolbyIoSDK module)
 */
function isInternalDocFile(filepath) {
  return !!new RegExp(REGEXP_MATCH_DOC_FILENAME).test(filepath);
}

/**
 * This function creates header slug (format slug prefix + module + filename in lowercase)
 * e.g. slug for a file `../docs/interfaces/internal.ConferenceMixingOptions.md` should look like
 * `rn-client-sdk-interfaces-conferencemixingoptions`
 * NOTE: at this point we assume filepath is correct (isInternalDocFile function should return true)
 */
function createHeaderSlug(filePath) {
  const sdkModule = filePath.match(REGEXP_MATCH_DOC_MODULE)[1];
  const rawFilename = filePath.match(REGEXP_MATCH_DOC_FILENAME)[1];
  return SLUG_PREFIX + sdkModule + `-${rawFilename.toLowerCase()}`;
}

/**
 * This function gets module name from filepath, e.g. from `../docs/interfaces/Conference.md`
 * it should return `interfaces`
 */
function getFilePathModuleName(filePath) {
  const moduleName = filePath.match(REGEXP_MATCH_DOC_MODULE);
  if (moduleName) {
    return moduleName[1];
  }
  return '';
}

function changeLinkFormatReplacerFn(substring, moduleName) {
  let replaceString;
  const isRootInternalModule = new RegExp('internal.md').test(substring);
  if (isRootInternalModule) {
    replaceString = LINK_SLUG_PREFIX + 'modules-internal';
    return substring.replace(/(?<=\[.+]\().+\.md(?=(#.+)?\))/, replaceString);
  }
  const module = substring
    .replace(/interfaces/, 'models')
    .replace(/classes/, 'references')
    .match(/\(\.\.\/(.+)\//);
  const service = substring.match(/internal\.(.+)\.md(#.+)?\)/);
  if (!service) {
    if (substring.match(REGEXP_MATCH_DOC_FILENAME)[0] === 'CommsAPI.md') {
      const link = substring.match(/#\w+/);
      return substring.replace(/(?<=.+\()(.+)(?=\))/, link[0]);
    }
    console.error('service not found in changeLinkFormatReplaceFn', substring);
    return substring;
  }
  replaceString =
    LINK_SLUG_PREFIX +
    (module ? `${module[1]}-` : `${moduleName}-`) +
    `${service[1].toLowerCase()}`;

  return substring.replace(/(?<=\[.+]\().+\.md(?=.+\))?/, replaceString);
}
