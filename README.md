# JSCION

##JSON support for TypeScript/ES6 classes



**JSCION** allows deserialization of fully functional class instances from JSON.
 
Deserialized objects are instances of the classes they represented, during serialization.   
 
 
 **Example**
 
 Annotate a class as serializable
 
 ````
import {jscion} from '../index';

@jscion.serializable
class Car {
    model: string;

    sayHello() {
        console.log(`Hello I am ${this.model}`);
    }
}
````

Now you can serialize classes into JSON

````
const car = new Car();
car.model = 'Tesla Model 3';
const jsonString = jscion.stringify(car);

````

Parsing of the JSON produces functioning instances of the class. 


````
const deserializedCar = jscion.parse(jsonString);
````

Now you can invoke operation on deserialized class instance:

````
deserializedCar.sayHello();
````
See examples in the examples folder.



