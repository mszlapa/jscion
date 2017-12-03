
// USING SERIALIZATION EXAMPLE   ---------------

// define serializable class implementing logic

import {ClassyJson} from '../index';

// format json nicely
ClassyJson.config.stringifySpaces = 2;

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
ClassyJson.markAsSerializable(Car);

console.log('\n\n\nSerialization example ------');

const car = new Car();
car.model = 'Toyota Prius';


const jsonString = ClassyJson.stringify(car);
console.log('\nJSON with metadata: ', jsonString);


const rehydratedCar = ClassyJson.parse(jsonString);
console.log('\nRehydrated using metadata: ', rehydratedCar);

console.log('Now you can invoke operation on rehydrated object:');
rehydratedCar.sayHello();

