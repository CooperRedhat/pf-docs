const path = require('path');
const fs = require('fs-extra');
const _cloneDeep = require('lodash/cloneDeep');
const { toReactComponent } = require('./toReactComponent');

/**
 * Update component routes from markdown source.
 *
 * @param {object} params
 * @param {string} params.buildMode
 * @param {string} params.file
 * @param {string} params.outputBase
 * @param {object} params.routes
 * @param {string} params.source
 * @param {object} params.tsDocs
 * @returns {{}}
 */
const sourceMarkdownFile = ({
  buildMode = 'start',
  file,
  outputBase,
  routes,
  source = 'react',
  tsDocs
} = {}) => {
  let updatedRoutes = _cloneDeep(routes);

  if (path.basename(file).startsWith('_')) {
    return updatedRoutes;
  }

  const { jsx, pageData, outPath } = toReactComponent({
    file,
    source,
    buildMode,
    outputBase,
    tsDocs
  });

  if (jsx) {
    fs.outputFileSync(outPath, jsx);

    updatedRoutes[pageData.slug] = {
      id: pageData.id,
      title: pageData.title || pageData.id,
      toc: pageData.toc || [],
      ...(pageData.examples && { examples: pageData.examples }),
      ...(pageData.fullscreenExamples && { fullscreenExamples: pageData.fullscreenExamples }),
      section: pageData.section,
      source: pageData.source,
      ...(pageData.katacodaLayout && { katacodaLayout: pageData.katacodaLayout }),
      ...(pageData.hideNavItem && { hideNavItem: pageData.hideNavItem })
    };
  }

  return updatedRoutes;
};

module.exports = {
  sourceMarkdownFile
};
