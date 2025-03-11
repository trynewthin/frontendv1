/**
 * 智选车API文档
 * 智选车汽车推荐购买平台API文档
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */

import ApiClient from '../ApiClient';

/**
 * The ApiResponseObject model module.
 * @module model/ApiResponseObject
 * @version 1.0
 */
class ApiResponseObject {
    /**
     * Constructs a new <code>ApiResponseObject</code>.
     * @alias module:model/ApiResponseObject
     */
    constructor() { 
        
        ApiResponseObject.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>ApiResponseObject</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ApiResponseObject} obj Optional instance to populate.
     * @return {module:model/ApiResponseObject} The populated <code>ApiResponseObject</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new ApiResponseObject();

            if (data.hasOwnProperty('code')) {
                obj['code'] = ApiClient.convertToType(data['code'], 'Number');
            }
            if (data.hasOwnProperty('message')) {
                obj['message'] = ApiClient.convertToType(data['message'], 'String');
            }
            if (data.hasOwnProperty('data')) {
                obj['data'] = ApiClient.convertToType(data['data'], Object);
            }
        }
        return obj;
    }

    /**
     * Validates the JSON data with respect to <code>ApiResponseObject</code>.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ApiResponseObject</code>.
     */
    static validateJSON(data) {
        // ensure the json data is a string
        if (data['message'] && !(typeof data['message'] === 'string' || data['message'] instanceof String)) {
            throw new Error("Expected the field `message` to be a primitive type in the JSON string but got " + data['message']);
        }

        return true;
    }


}



/**
 * @member {Number} code
 */
ApiResponseObject.prototype['code'] = undefined;

/**
 * @member {String} message
 */
ApiResponseObject.prototype['message'] = undefined;

/**
 * @member {Object} data
 */
ApiResponseObject.prototype['data'] = undefined;






export default ApiResponseObject;

