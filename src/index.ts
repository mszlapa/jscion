// SERIALIZATION SUPPORT


const METADATA_NAMESPACE = '__meta__jscion_';


const DEFAULTS = {
    namespace: METADATA_NAMESPACE,      // key under which metadata is stored
    stringifySpaces: null,              // number of spaces used for formatting
    allowMetadataFieldInObjects: true,  // serialized objects will be mutated by having the metadata added (faster), deserialized objects will preserve metadat from JSON
    serializeAllClassesMetadata: false  // save metadata class information even if class is not marked as serializable
};


const config = Object.assign({}, DEFAULTS);

// registry of serializable classes
const serializableClassRegistry = {};

// marks a class as Serializable, can be used as class decorator
const serializable = (serializableClass) => {
    // this takes class not instance so instead of it.constructor.name we use it.name
    serializableClassRegistry[serializableClass.name] = serializableClass.prototype;
};


const stringifyReplacer = (key: string, value: any) => {
    let result = value;
    if (result && result.constructor && result.constructor.name
        && result.constructor.name !== 'Object' && result.constructor.name !== 'Number' && result.constructor.name !== 'String'
        && (config.serializeAllClassesMetadata || serializableClassRegistry[result.constructor.name] )
    ) {
        // enhance json with class information
        let constructorName = result.constructor.name;
        // if mutating objects is not allowed, clone first
        result = !config.allowMetadataFieldInObjects ? Object.assign( {}, result) : result;
        result[config.namespace] = {name: constructorName};
    }
    return result;
};


// use enhanced json to rebuild classes
const parseReviver = (key: string, value: any) => {

    if (value && value[config.namespace]) {

        const className = value[config.namespace].name;
        const prototype = serializableClassRegistry[className];

        if (!config.allowMetadataFieldInObjects) {
            delete value[config.namespace]; // remove metadata that came on parsed json
        }

        if (!prototype) {
            (config.serializeAllClassesMetadata ? console.log : console.error)(`Can't deserialize unknown class ${className}, register class with serializable(${className} before parsing JSON)`);
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
export const jscion = Object.freeze({
    stringifyReplacer,
    parseReviver,
    stringify,
    parse,
    serializable,
    config,
    DEFAULTS,
});



