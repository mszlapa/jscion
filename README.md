# JSCION

JavaScript **Class Instance** and plain Object Notation - adds TypeScript/ES6 class support to JSON.
 
 **JSCION** allows deserialization of fully functional class instances from JSON. Parsing results are not limited to plain objects, 
 but can also include instances of the classes.  
 
 
 **How is it different from plain JSON?**
 
- JSON preserves Object fields (data)
- JSCION additionally preserves prototype hierarchy (class methods) 
 
 
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

Now you can serialize class instances into a JSON string:
````
const car = new Car();
car.model = 'Tesla Model 3';
const jsonString = jscion.stringify(car);
````


Parsing this JSON string will produce a fully functioning instance of the original class `Car`:
````
const deserializedCar = jscion.parse(jsonString);
````


Newly parsed object is an class instance of the correct class:
````
console.log('It is a real class instance:', rehydratedCar instanceof Car);  // => true
````

on which  class methods can be invoked:
````
deserializedCar.sayHello();   //  =>  Hello I am Tesla Model 3
````


See more in the examples folder.



### Limitations

JSCION does not preserve instance methods (defined directly on object instance), this also means that fields containing lambda 
expressions will not be preserved.

Class must be known to JSCION prior to deserialization (parsing) attempt. It practice it means that file containing class registration:
```
@jscion.serializable
class Car {
```
must be imported (required) somewhere in the code before calling JSCION parse. This is usually the case and should rarely cause issues.


You must use JSCION to serialize object to string. Parsing output of built in JSON.stringify will not 'automagicaly' recreate 
class instances. JSCION adds meta data to generated json string, which allows it to later recreate class instances  by 
providing it with a right `prototype`.  

Classes (object prototypes) are matched by name. If you serialized a `class Car` into a String and later deserialized 
this String inside another process that implements a different `@jscion.serializable class Car` you need to ensure 
that both classes are compatible. Serialization allows your data models travel in space and time, travel safely. 

JSCION will add metadata information to class instances being serialized, therefore calling `jscion.stringify(data)` 
will mutate `data` object.

This can be switched off in configuration:

```
        jscion.config.allowMetadataFieldInObjects = false;
``` 

doing so will cause jscion to clone class instances being serialized, possibly incurring performance penalty.

See test `src/tests/2_configuration.ts` for usage and implications.



### Troubleshooting
#### Decorators don't work
Try one the following:
1. Add `"experimentalDecorators": true` to tsconfig.json

2. Explicitly call the method instead of using decorator annotation.
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



### Additional configuration

A global configuration object is exposed as `jscion.config` 
 ````
import {jscion} from 'jscion';
console.log(jscion.config);

````
configuration object contains:
````
{
    namespace,                          // key under which metadata is stored in serialized objects
    stringifySpaces: null,              // number of spaces passed to JSON.stringify for formatting
    allowMetadataFieldInObjects: true,  // serialized objects will be mutated by having the metadata added (faster), deserialized objects will preserve metadat from JSON
    serializeAllClassesMetadata: false  // save metadata class information even if class is not marked as serializable
}
````