// SERIALIZATION SUPPORT


const METADATA_NAMESPACE = '__meta__classyjson_';


const DEFAULTS = {
    namespace: METADATA_NAMESPACE,
    stringifySpaces: null,
    enhanceToJSON: false,             // todo enhance toJSON method of decorated class
    preserveMetadataOnLoad: false,
    addMetadataToAllClasses: true
    //handleCircularDependencies      - wishful thinking at the moment
};


const config = Object.assign({}, DEFAULTS);

// registry of serializable classes
const serializableClassRegistry = {};

// marks a class as Serializable, can be used as class decorator
const markAsSerializable = (serializableClass) => {
    // this takes class not instance so instead of it.constructor.name we use it.name
    serializableClassRegistry[serializableClass.name] = serializableClass.prototype;
};


const stringifyReplacer = (key: string, value: any) => {
    if (value && value.constructor && value.constructor.name
        && value.constructor.name !== 'Object' && value.constructor.name !== 'Number' && value.constructor.name !== 'String'
        && (config.addMetadataToAllClasses || serializableClassRegistry[value.constructor.name] )
    ) {
        // enhance json with class information
        value[METADATA_NAMESPACE] = {name: value.constructor.name};
    }
    return value;
};


// use enhanced json to rebuild classes
const parseReviver = (key: string, value: any) => {

    if (value && value[METADATA_NAMESPACE]) {

        const className = value[METADATA_NAMESPACE].name;
        const prototype = serializableClassRegistry[className];

        if (!config.preserveMetadataOnLoad) {
            delete value[METADATA_NAMESPACE]; // remove metadata that came on parsed json
        }

        if (!prototype) {
            console.error(`Cant deserialize unknown class ${className}, register class with markAsSerializable(${className} before parsing JSON)`);
            return value; // return as is
        }

        const asClass = Object.assign(Object.create(prototype), value);
        return asClass;
    }

    return value;
};

// serialize / deserialize operations
const stringify = (obj) => JSON.stringify(obj, stringifyReplacer, config.stringifySpaces);
const parse = (jsonString: string) => JSON.parse(jsonString, parseReviver);



// because namespaces save people from guessing
export const ClassyJson = Object.freeze({
    stringify,
    parse,
    markAsSerializable,
    config
});



