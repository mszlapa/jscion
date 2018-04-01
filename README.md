# JSCION

JavaScript Class Instance and plain Object Notation

## JSON support for TypeScript/ES6 classes  



**JSCION** allows deserialization of fully functional class instances from JSON.
 
Deserialized objects are instances of the classes they represented during serialization.   
 
 
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

Parsing this JSON string will produce a fully functioning instance of the class original. 


````
const deserializedCar = jscion.parse(jsonString);
````

Now you can invoke operation on deserialized class instance:

````
deserializedCar.sayHello();
````

See more in the examples folder.


** Limitations **

JSCION will add metadata information to class instances being serialized, therefore serialization will mutate data.

If this can be switched off in configuration

```
        jscion.config.allowMetadataFieldInObjects = false;
``` 

doing so will cause jscion to clone class intances being serialized, possibly incurring performance penalty.
See tests for usage and implications
