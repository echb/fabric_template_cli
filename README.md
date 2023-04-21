# Run without install

- start cli -> `npx fabric_template_cli`

- Input as simple object with nested values

```js
const jsonObject =
	'{ "name": "Harry Potter", "city": "London", "qty": [ 1, 3, 4 ], "streets": [ { "av1": 1, "av2": 1 } ] }';
```

- Output

```js
const isNull = (param) => param === undefined || param === null;

/** @class City */
class City {
	/**
	 * @param  {({ name:string|null|undefined,city:string|null|undefined,qty:Array<number>|null|undefined,streets:Array|null|undefined })} [param] - Description
	 */
	constructor({ name = null, city = null, qty = [], streets = [] } = {}) {
		this.name = isNull(name) ? null : name;
		this.city = isNull(city) ? null : city;
		this.qty = isNull(qty) ? null : qty;
		this.streets = isNull(streets) ? null : StreetsList(streets);
	}

	/**
	 * @param  {({ name:string|null|undefined,city:string|null|undefined,qty:Array<number>|null|undefined,streets:Array|null|undefined })} [param] - Description
	 * @returns {City} - New cloned instance of -> @class City
	 */
	copyWith({ name = null, city = null, qty = [], streets = [] } = {}) {
		return new City({
			name: isNull(name) ? this.name : name,
			city: isNull(city) ? this.city : city,
			qty: isNull(qty) ? this.qty : qty,
			streets: isNull(streets) ? this.streets : streets,
		});
	}
}

/**
 * @param {object} obj - Object to parse
 * @returns {Array<Streets>}
 */
const StreetsList = (obj) => obj.map((e) => new Streets(e));

/** @class Streets */
class Streets {
	/**
	 * @param  {({ av1:string|null|undefined,av2:string|null|undefined })} [param] - Description
	 */
	constructor({ av1 = null, av2 = null } = {}) {
		this.av1 = isNull(av1) ? null : av1;
		this.av2 = isNull(av2) ? null : av2;
	}

	/**
	 * @param  {({ av1:string|null|undefined,av2:string|null|undefined })} [param] - Description
	 * @returns {Streets} - New cloned instance of -> @class Streets
	 */
	copyWith({ av1 = null, av2 = null } = {}) {
		return new Streets({
			av1: isNull(av1) ? this.av1 : av1,
			av2: isNull(av2) ? this.av2 : av2,
		});
	}
}
```

- It also accepts an array

```js
const jsonObject = `[
	{
		"name": "Harry Potter",
		"city": "London",
		"qty": [1, 3, 4],
		"streets": [
			{
				"av1": 1,
				"av2": 1
			}
		]
	},
	{
		"name": "Don Quixote",
		"city": "Madrid",
		"qty": [1, 3, 4],
		"streets": [
			{
				"av1": 1,
				"av2": 1
			}
		]
	},
	{
		"name": "Joan of Arc",
		"city": "Paris",
		"qty": [1, 3, 4],
		"streets": [
			{
				"av1": 1,
				"av2": 1
			}
		]
	},
	{
		"name": "Rosa Park",
		"city": "Alabama",
		"qty": [1, 3, 4],
		"streets": [
			{
				"av1": 1,
				"av2": 1
			}
		]
	}
]`;
```

expected output

```js
/**
 * @param {object} obj - Object to parse
 * @returns {Array<City>}
 */
const CityList = (obj) => obj.map((e) => new City(e));

const isNull = (param) => param === undefined || param === null;

/** @class City */
class City {
	/**
	 * @param  {({ name:string|null|undefined,city:string|null|undefined,qty:Array<number>|null|undefined,streets:Array|null|undefined })} [param] - Description
	 */
	constructor({ name = null, city = null, qty = [], streets = [] } = {}) {
		this.name = isNull(name) ? null : name;
		this.city = isNull(city) ? null : city;
		this.qty = isNull(qty) ? null : qty;
		this.streets = isNull(streets) ? null : StreetsList(streets);
	}

	/**
	 * @param  {({ name:string|null|undefined,city:string|null|undefined,qty:Array<number>|null|undefined,streets:Array|null|undefined })} [param] - Description
	 * @returns {City} - New cloned instance of -> @class City
	 */
	copyWith({ name = null, city = null, qty = [], streets = [] } = {}) {
		return new City({
			name: isNull(name) ? this.name : name,
			city: isNull(city) ? this.city : city,
			qty: isNull(qty) ? this.qty : qty,
			streets: isNull(streets) ? this.streets : streets,
		});
	}
}

/**
 * @param {object} obj - Object to parse
 * @returns {Array<Streets>}
 */
const StreetsList = (obj) => obj.map((e) => new Streets(e));

/** @class Streets */
class Streets {
	/**
	 * @param  {({ av1:string|null|undefined,av2:string|null|undefined })} [param] - Description
	 */
	constructor({ av1 = null, av2 = null } = {}) {
		this.av1 = isNull(av1) ? null : av1;
		this.av2 = isNull(av2) ? null : av2;
	}

	/**
	 * @param  {({ av1:string|null|undefined,av2:string|null|undefined })} [param] - Description
	 * @returns {Streets} - New cloned instance of -> @class Streets
	 */
	copyWith({ av1 = null, av2 = null } = {}) {
		return new Streets({
			av1: isNull(av1) ? this.av1 : av1,
			av2: isNull(av2) ? this.av2 : av2,
		});
	}
}
```
