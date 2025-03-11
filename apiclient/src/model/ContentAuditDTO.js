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
 * The ContentAuditDTO model module.
 * @module model/ContentAuditDTO
 * @version 1.0
 */
class ContentAuditDTO {
    /**
     * Constructs a new <code>ContentAuditDTO</code>.
     * @alias module:model/ContentAuditDTO
     * @param status {Number} 
     */
    constructor(status) { 
        
        ContentAuditDTO.initialize(this, status);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj, status) { 
        obj['status'] = status;
    }

    /**
     * Constructs a <code>ContentAuditDTO</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ContentAuditDTO} obj Optional instance to populate.
     * @return {module:model/ContentAuditDTO} The populated <code>ContentAuditDTO</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new ContentAuditDTO();

            if (data.hasOwnProperty('status')) {
                obj['status'] = ApiClient.convertToType(data['status'], 'Number');
            }
            if (data.hasOwnProperty('remarks')) {
                obj['remarks'] = ApiClient.convertToType(data['remarks'], 'String');
            }
        }
        return obj;
    }

    /**
     * Validates the JSON data with respect to <code>ContentAuditDTO</code>.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ContentAuditDTO</code>.
     */
    static validateJSON(data) {
        // check to make sure all required properties are present in the JSON string
        for (const property of ContentAuditDTO.RequiredProperties) {
            if (!data.hasOwnProperty(property)) {
                throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
            }
        }
        // ensure the json data is a string
        if (data['remarks'] && !(typeof data['remarks'] === 'string' || data['remarks'] instanceof String)) {
            throw new Error("Expected the field `remarks` to be a primitive type in the JSON string but got " + data['remarks']);
        }

        return true;
    }


}

ContentAuditDTO.RequiredProperties = ["status"];

/**
 * @member {Number} status
 */
ContentAuditDTO.prototype['status'] = undefined;

/**
 * @member {String} remarks
 */
ContentAuditDTO.prototype['remarks'] = undefined;






export default ContentAuditDTO;

