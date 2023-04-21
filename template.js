export const strict = 'use strict'

export const isNull = `const isNull = (param) => param === undefined || param === null`;

export const createClassName = (className) => className.split('_').map((e) => `${e.charAt(0).toUpperCase() + e.slice(1)}`).join('');

export const parseFromArray = (isArray = false, className, initialClassPivot) => {
  if (!isArray) return ''

  return `
  /**
   * @param {object} obj - Object to parse
   * @returns {Array<${className}>}
   */
  const ${className}List = (obj) => obj.map((e)=> new ${initialClassPivot}(e))
  `
}

export const classTemplate = ({ className = 'ClassName', constructorParams, constructorThisKeys, isImmutable = false, classCopyWithKeyValue, jsDocs = '' } = {}) => `
/** @class ${className} */
class ${className} {
    /**
    * @param  {({ ${jsDocs} })} [param] - Description
    */
    constructor({
      ${constructorParams}
    } = {}) {
      ${constructorThisKeys}
      ${isImmutable ? 'Object.seal(this)' : ''}
    }

    /**
    * @param  {({ ${jsDocs} })} [param] - Description
    * @returns {${className}} - New cloned instance of -> @class ${className}
    */
    copyWith({ 
      ${constructorParams}
     } = {}) {
      return new ${className}({
        ${classCopyWithKeyValue}
      })
    }
  }
`;

export async function fabricClass({ className, jsonObject, immutable = false } = {}) {
  let objectKeys
  try {
    const rawJson = await JSON.parse(jsonObject)
    objectKeys = Object.keys(rawJson)
  } catch (error) {
    console.error('\nJson format incorrect\n');
    console.error(`error: ${error}`);
    process.exit(1)
  }


  const classNameBuild = createClassName(className)
  const constructorKeys = objectKeys.map((e) => `${e} = null`).join(',\n');
  const constructorThisKeys = objectKeys.map((e) => `this.${e} = isNull(${e}) ? null : ${e}`).join(';\n');
  const classCopyWithKeyValue = objectKeys.map((e) => `${e}: isNull(${e}) ? this.${e} : ${e}`).join(',\n');


  console.log(`
      ${isNull}
      ${classTemplate({
    className: classNameBuild,
    isImmutable: immutable,
    constructorParams: constructorKeys,
    constructorThisKeys: constructorThisKeys,
    classCopyWithKeyValue: classCopyWithKeyValue,
  })}`
  );
}