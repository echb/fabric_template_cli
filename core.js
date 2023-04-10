import { classTemplate, createClassName, isNull } from "./template.js";

const fabricClas = async ({ className, constructorKeys, constructorThisKeys, classCopyWithKeyValue, immutable = false, jsDocs = '' } = {}) =>
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
    !isArray(localObj[e])
      ? `this.${e} = isNull(${e}) ? null : ${e}`
      : `this.${e} = isNull(${e}) ? null : ${e}.map((e) => new ${createClassName(e)}(e))`
  )
    .join(';\n');
  const classCopyWithKeyValue = objKeysValuesSplit.objectKeys.map((e) => `${e}: isNull(${e}) ? this.${e} : ${e}`).join(',\n');

  const jsDocs = objKeysValuesSplit.objectKeys.map((e) => {
    if (isArray(localObj[e])) {
      return `${e}:Array|null|undefined`
    }
    return `${e}:${typeof e}|null|undefined`
  }).join(',')

  const models = await Promise.all(
    objKeysValuesSplit.objectKeys.map(async (e) => {
      return !isArray(localObj[e])
        ? fabricClas({
          className: classNameBuild,
          jsDocs: jsDocs,
          constructorKeys,
          constructorThisKeys,
          classCopyWithKeyValue,
          immutable: isImmutable
        })
        : await JsonPropsToModelProps({ fullObject: localObj[e], className: e })
    })
  )

  return models.flat()
}



export const modelsFabric = async ({
  className,
  jsonObject,
  immutable = false
} = {}) => {

  // const jsonObject = '[ { "n": 1, "b":[{"v":1}, {"v":2}] } ]'
  const parsedObj = await parseJson(jsonObject)
  const modelsList = await JsonPropsToModelProps({ fullObject: parsedObj, className: className, isImmutable: immutable })
  console.log(`
    ${isNull}
    ${modelsList.join('')}
  `);
}

// modelsFabric({
//   className: 'classCostructor_className',
//   jsonObject: '{ "a": 1, "b": [{ "v": "asd" }] }',
//   immutable: false
// })