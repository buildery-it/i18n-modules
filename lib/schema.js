const z = require('zod');

const keysRoot = z.string().optional();
const moduleEnding = z.string().endsWith('.json').optional();

const schema = z.object({
  keysRoot,
  moduleEnding,
  dictionaryPattern: z.string().includes('[locale_code]').endsWith('.json'),
  getId: z.function()
    .args(keysRoot, moduleEnding, z.string())
    .returns(z.string())
    .optional(),
});

const validate = (options) => {
  try {
    schema.parse(options);
  } catch (error) {
    console.error(error.errors);
  }
};

module.exports = validate;
