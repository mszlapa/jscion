# JSCION

JavaScript Class Instance and plain Object Notation

## JSON support for TypeScript/ES6 classes  



**JSCION** allows deserialization of fully functional class instances from JSON.
 
Deserialized objects are not plain objects, but instances of the same classes they represented during serialization.   
 
 
**Example**
 
Annotate a class as `@jscion.serializable`:
 
 ````
import {jscion} from 'jscion';

@jscion.serializable
class Car {
    model: string;

    sayHello() {
        console.log(`Hello I am ${this.model}`);
    }
}
````

Now you can serialize class instances into JSON:
````
const car = new Car();
car.model = 'Tesla Model 3';
const jsonString = jscion.stringify(car);
````


Parsing this JSON string will produce a fully functioning instance of the original class:
````
const deserializedCar = jscion.parse(jsonString);
````


It is a real class instance:
````
console.log('It is a real class instance:', rehydratedCar instanceof Car);
````


You can invoke methods right on parsed JSON:
````
deserializedCar.sayHello();   //  =>  Hello I am Tesla Model 3
````


See more in the examples folder.



### Limitations

You must use JSCION to serialize object to string. Parsing output of built in JSON.stringify will not automagicaly recreate classes. JSCION adds meta data to generated json string, which allows it to recreate class instances  by providing it with a right `prototype`.  

Classes (object prototypes) are matched by name. If you serialized a `class Car` into a String and later deserialized this String inside another process that implements a different `@jscion.serializable class Car` you need to ensure that both classes are compatible. Serialization allows your data models travel in space and time, travel safely. 

JSCION will add metadata information to class instances being serialized, therefore calling `jscion.stringify(data)` will mutate `data` object.

This can be switched off in configuration

```
        jscion.config.allowMetadataFieldInObjects = false;
``` 

doing so will cause jscion to clone class intances being serialized, possibly incurring performance penalty.

See test `src/tests/2_configuration.ts` for usage and implications.



### Troubleshooting
#### Decorators don't work
Try one the following:
1. Add `"experimentalDecorators": true` to tsconfig.json

2. Use mtmethod instead of decorator
````
class Car {
  model: string;

  sayHello() {
    console.log(`Hello I am ${this.model}`);
  }
}

jscion.serializable(Car);
````

#### Your IDE flags decorator method
Alias decorator method:
````
const jscionSerializable = jscion.serializable;

@jscionSerializable
class Car {
....
````
or use braces to clarify order of execution
````
@(jscion.serializable)
class Car {
....
````

