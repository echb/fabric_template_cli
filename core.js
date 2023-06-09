import { classTemplate, createClassName, isNull, parseFromArray } from "./template.js";

const fabricClass = async ({ className, constructorKeys, constructorThisKeys, classCopyWithKeyValue, immutable = false, jsDocs = '' } = {}) =>
  `${classTemplate({
    className: className,
    isImmutable: immutable,
    constructorParams: constructorKeys,
    constructorThisKeys: constructorThisKeys,
    classCopyWithKeyValue: classCopyWithKeyValue,
    jsDocs: jsDocs
  })}
  `;

const isArray = (obj) => Array.isArray(obj)

const isArrayWithObjInitalValue = (value) => {
  if (!isArray(value)) {
    return false
  }

  if (typeof value[0] === 'object') {
    return true
  }

  return false
}

const isPrimitive = (value) => {
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string') {
    return true
  }

  return false
}

async function parseJson(jsonString) {
  let rawJson = null
  try {
    rawJson = await JSON.parse(jsonString)
  } catch (error) {
    console.error('\nJson format incorrect\n');
    console.error(`error: ${error}`);
    process.exit(1)
  }
  return rawJson
}

async function JsonPropsToModelProps({ fullObject, className = null, isImmutable = false }) {
  let localObj = null
  let objKeysValuesSplit = {
    objectKeys: {},
    objectValues: {},
  }

  if (isArray(fullObject)) {
    localObj = fullObject[0];
    objKeysValuesSplit = {
      ...objKeysValuesSplit,
      objectKeys: Object.keys(fullObject[0]),
      objectValues: Object.values(fullObject[0])
    }
  } else {
    localObj = fullObject;
    objKeysValuesSplit = {
      ...objKeysValuesSplit,
      objectKeys: Object.keys(fullObject),
      objectValues: Object.values(fullObject)
    }
  }

  const classNameBuild = createClassName(className)
  const constructorKeys = objKeysValuesSplit.objectKeys.map((e) =>
    !isArray(localObj[e])
      ? `${e} = null`
      : `${e} = []`
  ).join(',\n');

  const constructorThisKeys = objKeysValuesSplit.objectKeys.map((e) =>
    !isArrayWithObjInitalValue(localObj[e])
      ? `this.${e} = isNull(${e}) ? null : ${e}`
      : `this.${e} = isNull(${e}) ? null : ${createClassName(e)}List(${e});`
  )
    .join(';\n');
  const classCopyWithKeyValue = objKeysValuesSplit.objectKeys.map((e) => `${e}: isNull(${e}) ? this.${e} : ${e}`).join(',\n');

  const jsDocs = objKeysValuesSplit.objectKeys.map((e) => {
    if (!isArray(localObj[e])) {
      return `${e}:${typeof e}|null|undefined`
    }

    if (isPrimitive(localObj[e][0])) {
      return `${e}:Array<${typeof localObj[e][0]}>|null|undefined`
    }

    return `${e}:Array|null|undefined`
  }).join(',')

  const nestedValues = objKeysValuesSplit.objectKeys.filter((e) => isArrayWithObjInitalValue(localObj[e]))
  const nestedClasses = await Promise.all(
    nestedValues.map(async (e) => [parseFromArray(isArray(localObj[e]), createClassName(e), createClassName(e)), await JsonPropsToModelProps({ fullObject: localObj[e], className: e })])
  )

  const mainClass = await fabricClass({
    className: classNameBuild,
    jsDocs: jsDocs,
    constructorKeys,
    constructorThisKeys,
    classCopyWithKeyValue,
    immutable: false
  })

  return [mainClass, nestedClasses].flat(3)
}


export const modelsFabric = async ({
  className,
  jsonObject,
  immutable = false
} = {}) => {
  const parsedObj = await parseJson(jsonObject)
  const modelsList = await JsonPropsToModelProps({ fullObject: parsedObj, className: className, isImmutable: immutable })

  console.log(`
    ${parseFromArray(isArray(parsedObj), createClassName(className), createClassName(className))}
    ${isNull}
    ${modelsList.join('')}
  `);
}

// modelsFabric({
//   className: 'list',
//   jsonObject: '[{ "a": 1, "b": [{ "v": "asd" }] }]',
//   immutable: false
// })