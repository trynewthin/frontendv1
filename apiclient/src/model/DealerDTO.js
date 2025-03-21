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
 * The DealerDTO model module.
 * @module model/DealerDTO
 * @version 1.0
 */
class DealerDTO {
    /**
     * Constructs a new <code>DealerDTO</code>.
     * @alias module:model/DealerDTO
     * @param dealerName {String} 
     */
    constructor(dealerName) { 
        
        DealerDTO.initialize(this, dealerName);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj, dealerName) { 
        obj['dealerName'] = dealerName;
    }

    /**
     * Constructs a <code>DealerDTO</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/DealerDTO} obj Optional instance to populate.
     * @return {module:model/DealerDTO} The populated <code>DealerDTO</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new DealerDTO();

            if (data.hasOwnProperty('dealerName')) {
                obj['dealerName'] = ApiClient.convertToType(data['dealerName'], 'String');
            }
            if (data.hasOwnProperty('address')) {
                obj['address'] = ApiClient.convertToType(data['address'], 'String');
            }
            if (data.hasOwnProperty('businessLicense')) {
                obj['businessLicense'] = ApiClient.convertToType(data['businessLicense'], 'String');
            }
            if (data.hasOwnProperty('contactPerson')) {
                obj['contactPerson'] = ApiClient.convertToType(data['contactPerson'], 'String');
            }
            if (data.hasOwnProperty('contactPhone')) {
                obj['contactPhone'] = ApiClient.convertToType(data['contactPhone'], 'String');
            }
            if (data.hasOwnProperty('description')) {
                obj['description'] = ApiClient.convertToType(data['description'], 'String');
            }
        }
        return obj;
    }

    /**
     * Validates the JSON data with respect to <code>DealerDTO</code>.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @return {boolean} to indicate whether the JSON data is valid with respect to <code>DealerDTO</code>.
     */
    static validateJSON(data) {
        // check to make sure all required properties are present in the JSON string
        for (const property of DealerDTO.RequiredProperties) {
            if (!data.hasOwnProperty(property)) {
                throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
            }
        }
        // ensure the json data is a string
        if (data['dealerName'] && !(typeof data['dealerName'] === 'string' || data['dealerName'] instanceof String)) {
            throw new Error("Expected the field `dealerName` to be a primitive type in the JSON string but got " + data['dealerName']);
        }
        // ensure the json data is a string
        if (data['address'] && !(typeof data['address'] === 'string' || data['address'] instanceof String)) {
            throw new Error("Expected the field `address` to be a primitive type in the JSON string but got " + data['address']);
        }
        // ensure the json data is a string
        if (data['businessLicense'] && !(typeof data['businessLicense'] === 'string' || data['businessLicense'] instanceof String)) {
            throw new Error("Expected the field `businessLicense` to be a primitive type in the JSON string but got " + data['businessLicense']);
        }
        // ensure the json data is a string
        if (data['contactPerson'] && !(typeof data['contactPerson'] === 'string' || data['contactPerson'] instanceof String)) {
            throw new Error("Expected the field `contactPerson` to be a primitive type in the JSON string but got " + data['contactPerson']);
        }
        // ensure the json data is a string
        if (data['contactPhone'] && !(typeof data['contactPhone'] === 'string' || data['contactPhone'] instanceof String)) {
            throw new Error("Expected the field `contactPhone` to be a primitive type in the JSON string but got " + data['contactPhone']);
        }
        // ensure the json data is a string
        if (data['description'] && !(typeof data['description'] === 'string' || data['description'] instanceof String)) {
            throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data['description']);
        }

        return true;
    }


}

DealerDTO.RequiredProperties = ["dealerName"];

/**
 * @member {String} dealerName
 */
DealerDTO.prototype['dealerName'] = undefined;

/**
 * @member {String} address
 */
DealerDTO.prototype['address'] = undefined;

/**
 * @member {String} businessLicense
 */
DealerDTO.prototype['businessLicense'] = undefined;

/**
 * @member {String} contactPerson
 */
DealerDTO.prototype['contactPerson'] = undefined;

/**
 * @member {String} contactPhone
 */
DealerDTO.prototype['contactPhone'] = undefined;

/**
 * @member {String} description
 */
DealerDTO.prototype['description'] = undefined;






export default DealerDTO;

