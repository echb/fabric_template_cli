
import { classTemplate, createClassName } from "./template.js";

const jsonObject = '[ { "a": 1, "b":[{"v":1}, {"v":2}] } ]'


// --------
async function fabricClass({ className, constructorKeys, constructorThisKeys, classCopyWithKeyValue, immutable = false, jsDocs = '' } = {}) {
  // ${isNull}
  return `
      ${classTemplate({
    className: className,
    isImmutable: immutable,
    constructorParams: constructorKeys,
    constructorThisKeys: constructorThisKeys,
    classCopyWithKeyValue: classCopyWithKeyValue,
    jsDocs: jsDocs
  })
    }`;
}
// --------
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

async function lo({ fullObject, className = null }) {
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
        ? fabricClass({
          className: classNameBuild,
          jsDocs: jsDocs,
          constructorKeys,
          constructorThisKeys,
          classCopyWithKeyValue,
          immutable: false
        })
        : await lo({ fullObject: localObj[e], className: e })
    })
  )

  return models.flat()
}

const parsedObj = await parseJson(jsonObject)
const r = await lo({ fullObject: parsedObj, className: 'a' })
console.log(r.join(''));


const ras = {
  "a": 1,
}


// ------------
// const isNull = (param) => param === undefined || param === null

// /** @class A */
// class A {
//   /**
//   * @param  {({ a:number|null|undefined, b:Array|null|undefined })} [A] -
//   */
//   constructor({
//     a = null,
//     b = []
//   } = {}) {
//     this.a = isNull(a) ? null : a;
//     this.b = isNull(b) ? null : b.map((e) => new B(e))
//   }

//   /**
//   * @param  {({ a:number|null|undefined, b:Array|null|undefined })} [A] -
//   */
//   copyWith({
//     a = null,
//     b = null
//   } = {}) {
//     return new A({
//       a: isNull(a) ? this.a : a,
//       b: isNull(b) ? this.b : b
//     })
//   }
// }

// class B {
//   /**
//    * Assign the project to an employee.
//    * @param {Object} me - The employee who is responsible for the project.
//    * @param {string?} me.v  - The name of the employee.
//    */
//   constructor({
//     v = null
//   } = { v: null }) {
//     this.v = isNull(v) ? null : v
//   }
// }

// const fa = { "b": [{ "c": 1 }, { "v": 2 }] }
// // const fa = { "a": 1 }
// const das = new A({ a: 1, b: [{ v: 'asd' }] });
// console.log(das.copyWith({}).a);



// /**
//  * @typedef {"keyvalue" | "bar" | "timeseries" | "pie" | "table"} MetricFormat
//  * @param position {MetricFormat}
//  */
// /**
//  * Set the arrow position of the tooltip
//  * @param {"up"|"down"|"left"|"right"} [position=left] - pointer position
//  */
// function has(position) {
//   console.log(position);
// };

// has("bar");



// /**
//  * @param  {({ a:number?, b:number?, c:string? })} [gas] - sdad
//  */
// function asda({ a = null, b = null, c = null } = { a: null, b: null, c: null }) {

// }
// asda()
// ---------