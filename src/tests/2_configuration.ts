import {jscion} from "../index"
import {expect} from "chai";


class AClass {
    aProperty: string;

    // test different types
    someData = {
        aDate: Date.now(),
        aNumber: 1,
        anArray: [1, null, {k: 'val'}]
    };

    aMethod() {
        return this.aProperty;
    };
}
jscion.serializable(AClass);

let testInstance;

beforeEach( () => {
    testInstance = new AClass();
    testInstance.aProperty = 'test';
    console.log('new');
});


describe('configuration', () => {

    beforeEach( () => {
        // reset configuration
        Object.assign( jscion.config, jscion.DEFAULTS);
    })


    it('should use custom namespace', () => {

        jscion.config.namespace ='testnamespace';
        const jsonString = jscion.stringify(testInstance);
        expect(jsonString.indexOf(jscion.config.namespace)).to.not.equal(-1);
    });


    it('should  allowMetadataFieldInObjects by default', () => {


        const jsonString = jscion.stringify(testInstance);
        const parsed = jscion.parse(jsonString);

        expect(parsed.aMethod()).to.equal('test'); // still works

        expect(testInstance[jscion.config.namespace]).to.not.be.undefined;
        expect(parsed[jscion.config.namespace]).to.be.not.undefined;
    });

    it('should NOT allowMetadataFieldInObjects when configured', () => {

        jscion.config.allowMetadataFieldInObjects = false;

        const jsonString = jscion.stringify(testInstance);
        const parsed = jscion.parse(jsonString);

        expect(parsed.aMethod()).to.equal('test'); //still works

        expect(testInstance[jscion.config.namespace]).to.be.undefined;
        expect(parsed[jscion.config.namespace]).to.be.undefined;
    });


});