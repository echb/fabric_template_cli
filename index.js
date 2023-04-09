#!/usr//bin/env node

import inquirer from "inquirer";
import { createSpinner } from "nanospinner";
import { classTemplate, isNull } from "./template.js";



const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

const createClassName = (className) => className.split('_').map((e) => `${e.charAt(0).toUpperCase() + e.slice(1)}`).join('');


const classCostructor = {
  className: null,
  jsonObject: null,
  immutable: null,
}


async function init() {
  const answersClassName = await askClassName()
  const answersMakeImmutable = await askImmutableClass()
  const answersJsonObject = await askJson()

  classCostructor.className = answersClassName.class_name
  classCostructor.jsonObject = answersJsonObject.json_object
  classCostructor.immutable = answersMakeImmutable.immutable

  const spinner = createSpinner('Creating class...\n').start()
  await fabricClass({ jsonObject: classCostructor.jsonObject, className: classCostructor.className, immutable: classCostructor.immutable })
  spinner.success({ text: 'Done' })

}

async function askClassName() {
  return await inquirer.prompt({
    name: 'class_name',
    type: "input",
    message: 'enter the class name separated by _',
  })
}
async function askImmutableClass() {
  return await inquirer.prompt({
    name: 'immutable',
    type: "confirm",
    message: 'allow the class to be immuatble (freeze)',
    default: false,
  })
}


async function askJson() {
  return await inquirer.prompt({
    name: 'json_object',
    type: "input",
    message: 'Enter the json object',
  })
}

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

await init()


function template() {
  return `
  class ${classNameBuild} {
    constructor({
      ${constructorKeys}
    } = {}) {
      ${constructorThisKeys}
      Object.freeze(this)
    }

    copyWith({ 
      ${constructorKeys}
     } = {}) {
      return new ${classNameBuild}({
        ${classCopyWithKeyValue}
      })
    }
  }
  `
}

// class Person {
//   constructor({
//     age = NULL,
//     firstName = NULL,
//     lastName = NULL,
//     email = NULL,
//   } = {}) {
//     this.age = isNull(age) ? null : age;
//     this.firstName = isNull(firstName) ? null : firstName;
//     this.lastName = isNull(lastName) ? null : lastName;
//     this.email = isNull(email) ? null : email;
//     Object.freeze(this)
//   }

//   copyWith({ age = NULL, firstName = NULL } = {}) {
//     return new Person({
//       age: isNull(age) ? this.age : age,
//       firstName: isNull(firstName) ? this.firstName : age
//     })
//   }
// }