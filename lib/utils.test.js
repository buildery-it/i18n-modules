const {
  escapeRegex,
  rebase,
  getContext,
  getOptions,
  getModuleId,
  getDictionaryRegex,
  getLanguage,
  getCleanGenerated,
  getCleanSeed,
  getSortedObject,
  getDeepSortedObject,
} = require('./utils');

const getRandomlySortedObject = (source) => Object.keys(source)
  .sort(() => (Math.random() > 0.5 ? 1 : -1))
  .reduce((acc, key) => {
    acc[key] = source[key];
    return acc;
  }, {});

const runCallbackTimesSync = (fn, times = 100) => {
  for (let i = 0; i < times; i++) fn();
};

describe('utils', () => {
  test('escapeRegex', () => {
    expect(escapeRegex('\\ ^ $ * + ? . ( ) | { } [ ]')).toBe('\\\\ \\^ \\$ \\* \\+ \\? \\. \\( \\) \\| \\{ \\} \\[ \\]');
    expect(escapeRegex('foo - bar')).toBe('foo \\x2d bar');
    expect(new RegExp(escapeRegex('-'), 'u').test('-')).toBe(true);
  });

  test('rebase', () => {
    expect(rebase()).toBe(process.cwd());
    expect(rebase('/abc')).toBe('/abc');
    expect(rebase('/abc', '/def')).toBe('/def');
    expect(rebase('/abc', './def')).toBe('/abc/def');
    expect(rebase('/abc', 'def')).toBe('/abc/def');
  });

  test('getContext', () => {
    expect(typeof getContext()).toBe('string');

    const context = './subfolder';
    process.env.I18N_MODULES_CONTEXT = context;
    expect(getContext().endsWith(context.slice(1))).toBe(true);
  });

  test('getOptions', () => {
    const result = getOptions();
    expect(typeof result).toBe('object');
    expect(typeof result.keysRoot).toBe('string');
    expect(typeof result.moduleEnding).toBe('string');
  });

  test('getModuleId', () => {
    const path = '/project/subfolder/a/b/c/module.with.lots.of.dots.whatever.json';
    const root = '/project';
    const ending = 'whatever.json';
    const result = getModuleId(root, ending, path);

    expect(result).toContain('module');
    expect(result.startsWith('/')).toBe(false);
    expect(result).not.toContain('.');
    expect(result).not.toContain('project');
    expect(result).not.toContain('whatever');
  });

  test('getDictionaryRegex', () => {
    const path = '/whatever/bloomer/myfile-[locale_code].json';
    const expected = '/whatever/bloomer/myfile-de-DE.json';

    const result = getDictionaryRegex(path);

    expect(result).toBeInstanceOf(RegExp);
    expect(result.test(expected)).toBe(true);
    expect(result.test(`${expected}.bson`)).toBe(false);
    expect(result.test(expected.replace('.json', '.bson'))).toBe(false);
  });

  test('getLanguage', () => {
    expect(getLanguage('/whatever/bloomer/de-DE.json')).toBe('de-DE');
    expect(getLanguage('/whatever/bloomer/kz.json')).toBe('kz');
    expect(getLanguage('/whatever/bloomer/somecrappyfile.json')).toBe(undefined);
    expect(getLanguage('/whatever/bloomer/maybe-de-DE-butnot.json')).toBe(undefined);
  });

  test('getCleanSeed', () => {
    const dirty = {
      a: 1,
      b: 2,
      'module:a/b/c': 3,
      'module:d/e/f': 4,
      'd/e/f': 5,
    };

    const clean = {
      a: 1,
      b: 2,
      'd/e/f': 5,
    };

    expect(getCleanSeed(dirty)).toEqual(clean);
  });

  test('getCleanGenerated', () => {
    const dirty = {
      a: 1,
      b: 2,
      'module:a/b/c': 3,
      'module:d/e/f': 4,
      'd/e/f': 5,
    };

    const clean = {
      'module:a/b/c': 3,
      'module:d/e/f': 4,
    };

    expect(getCleanGenerated(dirty)).toEqual(clean);
  });

  test('getSortedObject', () => {
    runCallbackTimesSync(() => {
      const obj = getRandomlySortedObject({
        a: 1,
        a_1: 1,
        a_b: 1,
        ab_c: 1,
        abc_1: 1,
        abc: 1,
      });

      const expected = { a: 1, abc: 1, abc_1: 1, ab_c: 1, a_1: 1, a_b: 1 };

      const deepObj = getRandomlySortedObject({
        deep: obj,
        a: 1,
        a_b: 1,
        ab_c: 1,
        abc: 1,
      });

      expect(Object.keys(getSortedObject(obj))).toEqual(Object.keys(expected));
      expect(Object.keys(getSortedObject(deepObj, true).deep)).toEqual(Object.keys(expected));
    });
  });

  test('getDeepSortedObject', () => {
    runCallbackTimesSync(() => {
      const obj = getRandomlySortedObject({
        a: 1,
        a_1: 1,
        a_b: 1,
        ab_c: 1,
        abc_1: 1,
        abc: 1,
      });

      const expected = { a: 1, abc: 1, abc_1: 1, ab_c: 1, a_1: 1, a_b: 1 };

      const deepObj = getRandomlySortedObject({
        deep: obj,
        a: 1,
        a_b: 1,
        ab_c: 1,
        abc: 1,
      });

      expect(Object.keys(getDeepSortedObject(deepObj).deep)).toEqual(Object.keys(expected));
    });
  });
});
