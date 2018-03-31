
// Basic SERIALIZATION EXAMPLE    ---------------

// define serializable class implementing logic

import {jscion} from '../index';

// format json nicely
jscion.config.stringifySpaces = 2;

class Car {
    model: string;

    // test different types
    someData = {
        aDate: Date.now(),
        aNumber: 1,
        anUndefined: undefined,
        anArray : [ 1, undefined, {k:'val'}]
    };

    sayHello() {
        console.log(`Hello I am ${this.model}`);
    };
}
jscion.serializable(Car);

console.log('\n\n\nSerialization example ------');

const car = new Car();
car.model = 'Tesla Model 3';


const jsonString = jscion.stringify(car);
console.log('\nJSON with metadata: \n', jsonString);


const rehydratedCar = jscion.parse(jsonString);
console.log('\nRehydrated using metadata:\n', rehydratedCar);

console.log('\n\nNow you can invoke operation on rehydrated object:');
rehydratedCar.sayHello();

