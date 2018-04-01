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
});

describe('serialize', () => {
    it('should add metadata', () => {

        const jsonString = jscion.stringify(testInstance);
        expect(jsonString.indexOf(jscion.config.namespace)).to.not.equal(-1);
    });

});


describe('deserialize', () => {

    it('should preserve members', () => {

        const jsonString = jscion.stringify(testInstance);
        const parsed = jscion.parse(jsonString);

        expect(parsed.aProperty).to.equal(testInstance.aProperty);
        expect(parsed.someData).to.deep.equal(testInstance.someData);
        expect(parsed).to.deep.equal(testInstance);
    });

    it('should preserve methods', () => {

        const jsonString = jscion.stringify(testInstance);
        const parsed = jscion.parse(jsonString);

        expect(parsed.aMethod).to.be.a('function');
        expect(parsed.aMethod()).to.equal('test');
    });

});

