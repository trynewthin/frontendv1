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
 * The CarDetailDTO model module.
 * @module model/CarDetailDTO
 * @version 1.0
 */
class CarDetailDTO {
    /**
     * Constructs a new <code>CarDetailDTO</code>.
     * @alias module:model/CarDetailDTO
     */
    constructor() { 
        
        CarDetailDTO.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>CarDetailDTO</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/CarDetailDTO} obj Optional instance to populate.
     * @return {module:model/CarDetailDTO} The populated <code>CarDetailDTO</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new CarDetailDTO();

            if (data.hasOwnProperty('detailId')) {
                obj['detailId'] = ApiClient.convertToType(data['detailId'], 'Number');
            }
            if (data.hasOwnProperty('carId')) {
                obj['carId'] = ApiClient.convertToType(data['carId'], 'Number');
            }
            if (data.hasOwnProperty('engine')) {
                obj['engine'] = ApiClient.convertToType(data['engine'], 'String');
            }
            if (data.hasOwnProperty('transmission')) {
                obj['transmission'] = ApiClient.convertToType(data['transmission'], 'String');
            }
            if (data.hasOwnProperty('fuelType')) {
                obj['fuelType'] = ApiClient.convertToType(data['fuelType'], 'String');
            }
            if (data.hasOwnProperty('fuelConsumption')) {
                obj['fuelConsumption'] = ApiClient.convertToType(data['fuelConsumption'], 'Number');
            }
            if (data.hasOwnProperty('seats')) {
                obj['seats'] = ApiClient.convertToType(data['seats'], 'Number');
            }
            if (data.hasOwnProperty('color')) {
                obj['color'] = ApiClient.convertToType(data['color'], 'String');
            }
            if (data.hasOwnProperty('bodySize')) {
                obj['bodySize'] = ApiClient.convertToType(data['bodySize'], 'String');
            }
            if (data.hasOwnProperty('wheelbase')) {
                obj['wheelbase'] = ApiClient.convertToType(data['wheelbase'], 'Number');
            }
            if (data.hasOwnProperty('features')) {
                obj['features'] = ApiClient.convertToType(data['features'], 'String');
            }
            if (data.hasOwnProperty('warranty')) {
                obj['warranty'] = ApiClient.convertToType(data['warranty'], 'String');
            }
        }
        return obj;
    }

    /**
     * Validates the JSON data with respect to <code>CarDetailDTO</code>.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @return {boolean} to indicate whether the JSON data is valid with respect to <code>CarDetailDTO</code>.
     */
    static validateJSON(data) {
        // ensure the json data is a string
        if (data['engine'] && !(typeof data['engine'] === 'string' || data['engine'] instanceof String)) {
            throw new Error("Expected the field `engine` to be a primitive type in the JSON string but got " + data['engine']);
        }
        // ensure the json data is a string
        if (data['transmission'] && !(typeof data['transmission'] === 'string' || data['transmission'] instanceof String)) {
            throw new Error("Expected the field `transmission` to be a primitive type in the JSON string but got " + data['transmission']);
        }
        // ensure the json data is a string
        if (data['fuelType'] && !(typeof data['fuelType'] === 'string' || data['fuelType'] instanceof String)) {
            throw new Error("Expected the field `fuelType` to be a primitive type in the JSON string but got " + data['fuelType']);
        }
        // ensure the json data is a string
        if (data['color'] && !(typeof data['color'] === 'string' || data['color'] instanceof String)) {
            throw new Error("Expected the field `color` to be a primitive type in the JSON string but got " + data['color']);
        }
        // ensure the json data is a string
        if (data['bodySize'] && !(typeof data['bodySize'] === 'string' || data['bodySize'] instanceof String)) {
            throw new Error("Expected the field `bodySize` to be a primitive type in the JSON string but got " + data['bodySize']);
        }
        // ensure the json data is a string
        if (data['features'] && !(typeof data['features'] === 'string' || data['features'] instanceof String)) {
            throw new Error("Expected the field `features` to be a primitive type in the JSON string but got " + data['features']);
        }
        // ensure the json data is a string
        if (data['warranty'] && !(typeof data['warranty'] === 'string' || data['warranty'] instanceof String)) {
            throw new Error("Expected the field `warranty` to be a primitive type in the JSON string but got " + data['warranty']);
        }

        return true;
    }


}



/**
 * @member {Number} detailId
 */
CarDetailDTO.prototype['detailId'] = undefined;

/**
 * @member {Number} carId
 */
CarDetailDTO.prototype['carId'] = undefined;

/**
 * @member {String} engine
 */
CarDetailDTO.prototype['engine'] = undefined;

/**
 * @member {String} transmission
 */
CarDetailDTO.prototype['transmission'] = undefined;

/**
 * @member {String} fuelType
 */
CarDetailDTO.prototype['fuelType'] = undefined;

/**
 * @member {Number} fuelConsumption
 */
CarDetailDTO.prototype['fuelConsumption'] = undefined;

/**
 * @member {Number} seats
 */
CarDetailDTO.prototype['seats'] = undefined;

/**
 * @member {String} color
 */
CarDetailDTO.prototype['color'] = undefined;

/**
 * @member {String} bodySize
 */
CarDetailDTO.prototype['bodySize'] = undefined;

/**
 * @member {Number} wheelbase
 */
CarDetailDTO.prototype['wheelbase'] = undefined;

/**
 * @member {String} features
 */
CarDetailDTO.prototype['features'] = undefined;

/**
 * @member {String} warranty
 */
CarDetailDTO.prototype['warranty'] = undefined;






export default CarDetailDTO;

