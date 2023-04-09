export const strict = 'use strict'

export const isNull = `const isNull = (param) => param === undefined || param === null`;

export const classTemplate = ({ className = 'ClassName', constructorParams, constructorThisKeys, isImmutable, classCopyWithKeyValue } = {}) => `
  class ${className} {
    constructor({
      ${constructorParams}
    } = {}) {
      ${constructorThisKeys}
      ${isImmutable ? 'Object.seal(this)' : ''}
    }

    copyWith({ 
      ${constructorParams}
     } = {}) {
      return new ${className}({
        ${classCopyWithKeyValue}
      })
    }
  }
`;