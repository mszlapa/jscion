# classic-json

##JSON support for  TypeScript/ES6 classes



**classic-json** allows serialization of Javascript class instances into json.
 
Deserialized objects are instances of the classes they represented. 
 
 
 **Example**
 
 Annotate a class as serializable
 
 ````
import {ClassyJson} from '../index';

@ClassyJson.markAsSerializable
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
const jsonString = ClassyJson.stringify(car);

````

Parsing of the JSON produces functioning instances of the class. 


````
const deserializedCar = ClassyJson.parse(jsonString);
console.log('Now you can invoke operation on rehydrated object: ');
````


See examples in the examples folder.



## Pending 

- more examples, especially ES6 

- tests

- troubleshooting how to

- configurability of METADATA namespace and serialization options
