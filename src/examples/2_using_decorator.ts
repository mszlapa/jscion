
//  SERIALIZATION EXAMPLE using TypeScript and decorators  ---------------


import {jscion} from '../index';

@jscion.serializable
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
    }
}

console.log('\n\n\nSerialization example ------');


const car = new Car();
car.model = 'Tesla Model 3';

const jsonString = jscion.stringify(car);
console.log('\nJSON with metadata: ', jsonString);


const rehydratedCar = jscion.parse(jsonString);
console.log('\nRehydrated using metadata: ', rehydratedCar);

console.log('\n\nNow you can invoke operation on rehydrated object: ');
rehydratedCar.sayHello();

